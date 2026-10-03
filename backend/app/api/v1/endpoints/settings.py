from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models import CompanySettings, ActivityLog, User
from app.schemas import CompanySettingsOut, CompanySettingsUpdate
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("", response_model=CompanySettingsOut)
async def get_company_settings(db: AsyncSession = Depends(get_db)):
    stmt = select(CompanySettings).where(CompanySettings.id == 1)
    settings = (await db.execute(stmt)).scalar_one_or_none()
    if not settings:
        # Create default initial record
        settings = CompanySettings(
            id=1,
            company_name="Company Name Not Configured",
            tagline="Technology Company & Verified Talent",
            primary_color="#000000",
            secondary_color="#ffffff",
            footer_copyright="All rights reserved."
        )
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    return settings

@router.put("", response_model=CompanySettingsOut)
async def update_company_settings(
    payload: CompanySettingsUpdate,
    request: Request,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(CompanySettings).where(CompanySettings.id == 1)
    settings = (await db.execute(stmt)).scalar_one_or_none()
    if not settings:
        settings = CompanySettings(id=1)
        db.add(settings)
        await db.flush()

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(settings, field, val)

    # Log activity
    log = ActivityLog(
        user_id=admin.id,
        action="BRAND_SETTINGS_UPDATED",
        entity_type="settings",
        entity_id=1,
        details=f"Company settings updated by CEO {admin.full_name}: {', '.join(update_data.keys())}",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)

    await db.commit()
    await db.refresh(settings)
    return settings
