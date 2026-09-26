import asyncio
from app.core.database import engine, Base, AsyncSessionLocal
from app.models import (
    User, DeveloperProfile, ClientProfile,
    Project, ProjectDeveloper, ClientInquiry, Notification,
    CommunityMessage
)
from sqlalchemy import delete

async def clear_all():
    print("Clearing all projects, users, inquiries, notifications...")
    async with AsyncSessionLocal() as db:
        await db.execute(delete(ProjectDeveloper))
        await db.execute(delete(Project))
        await db.execute(delete(ClientInquiry))
        await db.execute(delete(Notification))
        await db.execute(delete(CommunityMessage))
        await db.execute(delete(DeveloperProfile))
        await db.execute(delete(ClientProfile))
        await db.execute(delete(User))
        await db.commit()
    print("Clean database ready! 0 projects, 0 users.")

if __name__ == "__main__":
    asyncio.run(clear_all())
