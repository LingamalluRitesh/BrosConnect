from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models import ClientInquiry, DeveloperProfile, User, Notification, Conversation, ConversationMember
from app.schemas import ClientInquiryCreate, ClientInquiryUpdate, ClientInquiryOut
from app.api.deps import get_current_user

router = APIRouter()

@router.post("", response_model=ClientInquiryOut)
async def create_inquiry(
    payload: ClientInquiryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify developer exists
    dev_stmt = (
        select(DeveloperProfile)
        .join(DeveloperProfile.user)
        .where(DeveloperProfile.id == payload.developer_id)
        .options(selectinload(DeveloperProfile.user))
    )
    dev_profile = (await db.execute(dev_stmt)).scalar_one_or_none()
    if not dev_profile:
        raise HTTPException(status_code=404, detail="Target developer not found")

    new_inquiry = ClientInquiry(
        client_id=current_user.id,
        developer_id=dev_profile.id,
        project_name=payload.project_name,
        project_type=payload.project_type,
        budget_range=payload.budget_range,
        timeline=payload.timeline,
        description=payload.description,
        status="New"
    )
    db.add(new_inquiry)
    await db.flush()

    # Notify developer
    notif = Notification(
        user_id=dev_profile.user_id,
        title="New Project Inquiry",
        message=f"You received an inquiry from {current_user.full_name} for '{payload.project_name}'.",
        type="inquiry",
        link=f"/dashboard/inquiries"
    )
    db.add(notif)

    # Automatically create a private conversation for this inquiry (PRD Section 18)
    conv = Conversation(inquiry_id=new_inquiry.id)
    db.add(conv)
    await db.flush()

    m1 = ConversationMember(conversation_id=conv.id, user_id=current_user.id)
    m2 = ConversationMember(conversation_id=conv.id, user_id=dev_profile.user_id)
    db.add_all([m1, m2])

    await db.commit()
    await db.refresh(new_inquiry)

    # Re-fetch with relations
    inq_stmt = (
        select(ClientInquiry)
        .where(ClientInquiry.id == new_inquiry.id)
        .options(
            selectinload(ClientInquiry.client),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.user),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.skills)
        )
    )
    return (await db.execute(inq_stmt)).scalar_one()

@router.get("/developer", response_model=List[ClientInquiryOut])
async def get_developer_inquiries(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    dev_stmt = select(DeveloperProfile).where(DeveloperProfile.user_id == current_user.id)
    dev_profile = (await db.execute(dev_stmt)).scalar_one_or_none()
    if not dev_profile:
        return []

    stmt = (
        select(ClientInquiry)
        .where(ClientInquiry.developer_id == dev_profile.id)
        .options(
            selectinload(ClientInquiry.client),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.user),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.skills)
        )
        .order_by(ClientInquiry.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/client", response_model=List[ClientInquiryOut])
async def get_client_inquiries(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(ClientInquiry)
        .where(ClientInquiry.client_id == current_user.id)
        .options(
            selectinload(ClientInquiry.client),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.user),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.skills)
        )
        .order_by(ClientInquiry.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.put("/{inquiry_id}/status", response_model=ClientInquiryOut)
async def update_inquiry_status(
    inquiry_id: int,
    payload: ClientInquiryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(ClientInquiry)
        .where(ClientInquiry.id == inquiry_id)
        .options(
            selectinload(ClientInquiry.client),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.user),
            selectinload(ClientInquiry.developer).selectinload(DeveloperProfile.skills)
        )
    )
    inquiry = (await db.execute(stmt)).scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    # Only developer, client, or admin can update status
    is_authorized = (
        current_user.id == inquiry.client_id or
        current_user.id == inquiry.developer.user_id or
        current_user.role in ["super_admin", "managing_director", "admin"]
    )
    if not is_authorized:
        raise HTTPException(status_code=403, detail="Not authorized to update this inquiry")

    inquiry.status = payload.status
    await db.commit()
    await db.refresh(inquiry)
    return inquiry
