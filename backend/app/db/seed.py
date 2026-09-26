from sqlalchemy import select
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.security import get_password_hash
from app.models import (
    User, DeveloperProfile, Skill, Technology, CommunityChannel
)

async def seed_data():
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # 1. Ensure Core Skills & Technologies exist
        existing_skill = (await db.execute(select(Skill).limit(1))).scalar_one_or_none()
        if not existing_skill:
            print("Initializing Bro's Connect skills and community channels...")
            skill_names = [
                "Python", "FastAPI", "React", "TypeScript", "SQL", "PostgreSQL",
                "AI/ML", "TensorFlow", "PyTorch", "Docker", "Kubernetes", "Node.js",
                "Tailwind CSS", "Next.js", "Redis", "GraphQL", "AWS", "Flutter",
                "Django", "System Architecture", "DevOps", "Microservices"
            ]
            for s_name in skill_names:
                skill = Skill(name=s_name, category="Engineering")
                db.add(skill)

            for t_name in skill_names:
                tech = Technology(name=t_name)
                db.add(tech)

            await db.flush()

            # 2. Seed Default Community Channels
            channels_data = [
                ("general", "General discussions, welcome hub, and platform news", False),
                ("announcements", "Official Bro's Connect announcements & releases", False),
                ("architecture", "Systems design, high-concurrency architectures, and patterns", False),
                ("frontend", "React, TypeScript, CSS, UX, animations, and web frameworks", False),
                ("backend", "FastAPI, Python, microservices, databases, and APIs", False),
                ("ai-ml", "Autonomous agents, LLM pipelines, RAG, and machine learning", False),
                ("showcase", "Showcase your freshly published architectures and projects", False),
            ]
            for name, desc, is_locked in channels_data:
                ch = CommunityChannel(name=name, description=desc, is_locked=is_locked)
                db.add(ch)

            await db.flush()

        # 3. Ensure Default Super Admin exists
        admin_email = "riteshlingamallu8@gmail.com"
        existing_admin = (await db.execute(select(User).where(User.email == admin_email))).scalar_one_or_none()
        if not existing_admin:
            print(f"Creating default platform Super Admin: {admin_email}...")
            # Pick core skills for the CEO's developer profile
            skills_res = await db.execute(select(Skill).where(Skill.name.in_(["Python", "FastAPI", "React", "TypeScript", "SQL", "PostgreSQL", "AI/ML", "Docker"])))
            admin_skills = list(skills_res.scalars().all())

            admin_user = User(
                email=admin_email,
                username="riteshlingamallu8",
                full_name="Ritesh Lingamallu",
                phone="+91 9400900000",
                hashed_password=get_password_hash("Ritesh@94009"),
                role="super_admin",
                status="approved",
                is_active=True,
                is_verified=True,
                avatar_url=None
            )
            db.add(admin_user)
            await db.flush()

            admin_profile = DeveloperProfile(
                user_id=admin_user.id,
                title="Chief Executive Officer (CEO)",
                short_bio="Executive Leadership & System Architect at Bro's Connect.",
                bio="Leading full-lifecycle software engineering, platform architecture, and enterprise digital solutions at Bro's Connect.",
                location="India",
                availability="Available for Enterprise Advisory",
                years_experience=5,
                is_public=True,
                skills=admin_skills
            )
            db.add(admin_profile)
            await db.commit()
            print("Super Admin seeded successfully: riteshlingamallu8@gmail.com")
        else:
            await db.commit()
            print("System schemas, skills, and Super Admin verified.")
