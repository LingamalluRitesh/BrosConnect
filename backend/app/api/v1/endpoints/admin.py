from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models import (
    User, DeveloperProfile, ClientProfile, Project, ProjectDeveloper, ClientInquiry,
    CommunityChannel, Notification, Skill
)
from app.schemas import (
    DashboardStatsOut, DeveloperProfileOut, DeveloperApprovalRequest,
    ClientInquiryOut, ProjectOut, AdminUserOut, AdminUserUpdate
)
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/stats", response_model=DashboardStatsOut)
async def get_admin_dashboard_stats(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    total_devs = await db.scalar(select(func.count(User.id)).where(User.role == "developer")) or 0
    verified_devs = await db.scalar(select(func.count(User.id)).where(User.role == "developer", User.is_verified == True)) or 0
    pending_apps = await db.scalar(select(func.count(User.id)).where(User.role == "developer", User.status == "pending")) or 0
    total_projects = await db.scalar(select(func.count(Project.id))) or 0
    total_clients = await db.scalar(select(func.count(User.id)).where(User.role == "client")) or 0
    total_inquiries = await db.scalar(select(func.count(ClientInquiry.id))) or 0
    channels_count = await db.scalar(select(func.count(CommunityChannel.id))) or 0

    return DashboardStatsOut(
        total_developers=total_devs,
        verified_developers=verified_devs,
        pending_applications=pending_apps,
        total_projects=total_projects,
        total_clients=total_clients,
        total_inquiries=total_inquiries,
        active_channels=channels_count
    )

@router.get("/users", response_model=List[AdminUserOut])
async def list_all_users_for_admin(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(User)
        .options(
            selectinload(User.developer_profile).selectinload(DeveloperProfile.skills),
            selectinload(User.client_profile)
        )
        .order_by(User.id.asc())
    )
    users = (await db.execute(stmt)).scalars().all()

    # Get project counts mapped by developer_profile.id
    counts_stmt = (
        select(ProjectDeveloper.developer_id, func.count(ProjectDeveloper.project_id))
        .group_by(ProjectDeveloper.developer_id)
    )
    counts_res = await db.execute(counts_stmt)
    proj_counts = {r[0]: r[1] for r in counts_res.all()}

    output = []
    for u in users:
        dev_p_id = u.developer_profile.id if u.developer_profile else None
        p_count = proj_counts.get(dev_p_id, 0) if dev_p_id else 0
        u_out = AdminUserOut.model_validate(u)
        u_out.projects_count = p_count
        output.append(u_out)

    return output

@router.get("/users/{user_id}", response_model=AdminUserOut)
async def get_user_detail_for_admin(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.developer_profile).selectinload(DeveloperProfile.skills),
            selectinload(User.client_profile)
        )
    )
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    p_count = 0
    if user.developer_profile:
        cnt_stmt = select(func.count(ProjectDeveloper.project_id)).where(ProjectDeveloper.developer_id == user.developer_profile.id)
        p_count = (await db.scalar(cnt_stmt)) or 0

    u_out = AdminUserOut.model_validate(user)
    u_out.projects_count = p_count
    return u_out

@router.put("/users/{user_id}", response_model=AdminUserOut)
async def update_user_by_admin(
    user_id: int,
    payload: AdminUserUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.developer_profile).selectinload(DeveloperProfile.skills),
            selectinload(User.client_profile)
        )
    )
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update User core properties
    if payload.full_name is not None and payload.full_name.strip():
        user.full_name = payload.full_name.strip()
    if payload.phone is not None:
        user.phone = payload.phone.strip() if payload.phone.strip() else None
    if payload.avatar_url is not None:
        user.avatar_url = payload.avatar_url.strip() if payload.avatar_url.strip() else None
    if payload.role is not None and payload.role in ["super_admin", "managing_director", "admin", "developer", "client"]:
        user.role = payload.role
    if payload.status is not None and payload.status in ["approved", "pending", "rejected", "suspended"]:
        user.status = payload.status
    if payload.is_verified is not None:
        user.is_verified = payload.is_verified
    if payload.is_active is not None:
        user.is_active = payload.is_active

    # Update or create DeveloperProfile
    has_dev_fields = any([
        payload.title is not None,
        payload.short_bio is not None,
        payload.bio is not None,
        payload.location is not None,
        payload.availability is not None,
        payload.years_experience is not None,
        payload.skills is not None,
        payload.github_url is not None,
        payload.linkedin_url is not None,
        payload.portfolio_url is not None,
        payload.resume_url is not None
    ])

    if has_dev_fields or user.role in ["developer", "super_admin", "managing_director", "admin"]:
        if not user.developer_profile:
            user.developer_profile = DeveloperProfile(user_id=user.id)
            db.add(user.developer_profile)
            await db.flush()

        dev_p = user.developer_profile
        if payload.title is not None:
            dev_p.title = payload.title
        if payload.short_bio is not None:
            dev_p.short_bio = payload.short_bio
        if payload.bio is not None:
            dev_p.bio = payload.bio
        if payload.location is not None:
            dev_p.location = payload.location
        if payload.availability is not None:
            dev_p.availability = payload.availability
        if payload.years_experience is not None:
            dev_p.years_experience = payload.years_experience
        if payload.github_url is not None:
            dev_p.github_url = payload.github_url
        if payload.linkedin_url is not None:
            dev_p.linkedin_url = payload.linkedin_url
        if payload.portfolio_url is not None:
            dev_p.portfolio_url = payload.portfolio_url
        if payload.resume_url is not None:
            dev_p.resume_url = payload.resume_url

        if payload.skills is not None:
            dev_p.skills.clear()
            for s_name in payload.skills:
                clean_s = s_name.strip()
                if not clean_s:
                    continue
                skill_stmt = select(Skill).where(Skill.name.ilike(clean_s))
                skill = (await db.execute(skill_stmt)).scalar_one_or_none()
                if not skill:
                    skill = Skill(name=clean_s, category="Engineering")
                    db.add(skill)
                    await db.flush()
                dev_p.skills.append(skill)

    # Update or create ClientProfile
    if payload.company_name is not None or payload.website is not None or payload.industry is not None:
        if not user.client_profile:
            user.client_profile = ClientProfile(user_id=user.id)
            db.add(user.client_profile)
            await db.flush()
        if payload.company_name is not None:
            user.client_profile.company_name = payload.company_name
        if payload.website is not None:
            user.client_profile.website = payload.website
        if payload.industry is not None:
            user.client_profile.industry = payload.industry

    await db.commit()
    reloaded_stmt = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.developer_profile).selectinload(DeveloperProfile.skills),
            selectinload(User.client_profile)
        )
    )
    user_reloaded = (await db.execute(reloaded_stmt)).scalar_one()

    p_count = 0
    if user_reloaded.developer_profile:
        cnt_stmt = select(func.count(ProjectDeveloper.project_id)).where(ProjectDeveloper.developer_id == user_reloaded.developer_profile.id)
        p_count = (await db.scalar(cnt_stmt)) or 0

    u_out = AdminUserOut.model_validate(user_reloaded)
    u_out.projects_count = p_count
    return u_out

@router.delete("/users/{user_id}")
async def delete_user_by_admin(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    if admin.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security rule: Administrators cannot delete their own active account."
        )

    stmt = select(User).where(User.id == user_id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
    return {"status": "success", "message": f"User {user.username} deleted successfully", "user_id": user_id}

@router.get("/projects", response_model=List[ProjectOut])
async def list_all_projects_for_admin(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Project)
        .options(
            selectinload(Project.developer_associations).selectinload(ProjectDeveloper.developer).selectinload(DeveloperProfile.user),
            selectinload(Project.technologies)
        )
        .order_by(Project.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/pending-developers", response_model=List[DeveloperProfileOut])
async def list_pending_developer_applications(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(DeveloperProfile)
        .join(DeveloperProfile.user)
        .where(User.role == "developer", User.status == "pending")
        .options(
            selectinload(DeveloperProfile.user),
            selectinload(DeveloperProfile.skills)
        )
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/developers/{developer_profile_id}/action")
async def review_developer_application(
    developer_profile_id: int,
    payload: DeveloperApprovalRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(DeveloperProfile)
        .join(DeveloperProfile.user)
        .where(DeveloperProfile.id == developer_profile_id)
        .options(selectinload(DeveloperProfile.user))
    )
    dev_profile = (await db.execute(stmt)).scalar_one_or_none()
    if not dev_profile or not dev_profile.user:
        raise HTTPException(status_code=404, detail="Developer application not found")

    user = dev_profile.user
    if payload.action == "approve":
        user.status = "approved"
        user.is_verified = True
        notif = Notification(
            user_id=user.id,
            title="Application Approved!",
            message=f"Congratulations {user.full_name}! Your developer profile has been approved and verified by {admin.full_name}. You can now showcase projects and connect with clients.",
            type="approval",
            link=f"/developers/{user.username}"
        )
        db.add(notif)
    elif payload.action == "reject":
        user.status = "rejected"
        user.is_verified = False
        notif = Notification(
            user_id=user.id,
            title="Application Update",
            message=f"Thank you for your interest in Bro's Connect. Your application was not approved at this time. {payload.reason or ''}",
            type="rejection",
            link="/dashboard"
        )
        db.add(notif)
    elif payload.action == "suspend":
        user.status = "suspended"
        user.is_active = False
    elif payload.action == "restore":
        user.status = "approved"
        user.is_active = True

    await db.commit()
    return {"status": "success", "action": payload.action, "user_id": user.id}

@router.get("/inquiries", response_model=List[ClientInquiryOut])
async def list_all_inquiries(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(ClientInquiry)
        .options(
            selectinload(ClientInquiry.client),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.user),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.skills)
        )
        .order_by(ClientInquiry.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()
