from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models import User, DeveloperProfile, ClientProfile, Skill, Notification
from app.schemas import (
    RegisterDeveloperRequest,
    RegisterClientRequest,
    RegisterAdminRequest,
    LoginRequest,
    Token,
    UserOut
)
from app.api.deps import get_current_user

from sqlalchemy.orm import selectinload

router = APIRouter()

async def _get_user_with_profiles(user_id: int, db: AsyncSession) -> User:
    stmt = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.developer_profile).selectinload(DeveloperProfile.skills),
            selectinload(User.client_profile)
        )
    )
    return (await db.execute(stmt)).scalar_one()

@router.post("/register/developer", response_model=Token)
async def register_developer(payload: RegisterDeveloperRequest, db: AsyncSession = Depends(get_db)):
    # Check if email or username exists
    stmt = select(User).where(or_(User.email == payload.email, User.username == payload.username))
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email or username already exists"
        )
    
    # Create User
    new_user = User(
        email=payload.email,
        username=payload.username.strip().lower(),
        full_name=payload.full_name,
        phone=payload.phone,
        hashed_password=get_password_hash(payload.password),
        role="developer",
        status="pending", # Pending admin approval
        is_active=True,
        is_verified=False,
    )
    db.add(new_user)
    await db.flush()

    # Resolve skills
    skills_to_assign = []
    if payload.skills:
        for skill_name in payload.skills:
            skill_clean = skill_name.strip()
            if not skill_clean:
                continue
            skill_stmt = select(Skill).where(Skill.name.ilike(skill_clean))
            skill = (await db.execute(skill_stmt)).scalar_one_or_none()
            if not skill:
                skill = Skill(name=skill_clean)
                db.add(skill)
                await db.flush()
            skills_to_assign.append(skill)

    # Create Developer Profile
    dev_profile = DeveloperProfile(
        user_id=new_user.id,
        title=payload.title,
        short_bio=payload.short_bio,
        bio=payload.bio,
        location=payload.location,
        availability=payload.availability,
        years_experience=payload.years_experience,
        github_url=payload.github_url,
        linkedin_url=payload.linkedin_url,
        portfolio_url=payload.portfolio_url,
        resume_url=payload.resume_url,
        is_public=True,
        skills=skills_to_assign
    )
    db.add(dev_profile)

    # Add notification for the user
    user_notif = Notification(
        user_id=new_user.id,
        title="Application Received",
        message="Welcome to DevConnect! Your developer application has been submitted and is currently pending review by our leadership team.",
        type="approval",
        link="/dashboard"
    )
    db.add(user_notif)

    await db.commit()
    user_loaded = await _get_user_with_profiles(new_user.id, db)
    access_token = create_access_token(subject=new_user.id)
    return Token(access_token=access_token, user=user_loaded)

@router.post("/register/client", response_model=Token)
async def register_client(payload: RegisterClientRequest, db: AsyncSession = Depends(get_db)):
    # Check if email or username exists
    stmt = select(User).where(or_(User.email == payload.email, User.username == payload.username))
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email or username already exists"
        )
    
    new_user = User(
        email=payload.email,
        username=payload.username.strip().lower(),
        full_name=payload.full_name,
        phone=payload.phone,
        hashed_password=get_password_hash(payload.password),
        role="client",
        status="approved",
        is_active=True,
        is_verified=False
    )
    db.add(new_user)
    await db.flush()

    client_profile = ClientProfile(
        user_id=new_user.id,
        company_name=payload.company_name,
        website=payload.website,
        industry=payload.industry
    )
    db.add(client_profile)
    await db.commit()
    user_loaded = await _get_user_with_profiles(new_user.id, db)

    access_token = create_access_token(subject=new_user.id)
    return Token(access_token=access_token, user=user_loaded)

@router.post("/register/admin", response_model=Token)
async def register_admin():
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Admin registration is restricted. Please sign in using your administrator credentials."
    )

@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(User)
        .where(
            or_(
                User.email == payload.email_or_username,
                User.username == payload.email_or_username.strip().lower()
            )
        )
        .options(
            selectinload(User.developer_profile).selectinload(DeveloperProfile.skills),
            selectinload(User.client_profile)
        )
    )
    user = (await db.execute(stmt)).scalar_one_or_none()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated")
    if user.status == "suspended":
        raise HTTPException(status_code=403, detail="Your account has been suspended by administration")

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, user=user)

@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
