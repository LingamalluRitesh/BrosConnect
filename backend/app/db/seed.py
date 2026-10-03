from sqlalchemy import select
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.security import get_password_hash
from app.models import (
    User, DeveloperProfile, Skill, Technology, CommunityChannel, CompanySettings
)

async def seed_data():
    async with engine.begin() as conn:
        # Create all tables (including newly added CompanySettings, ActivityLog, etc.)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # 1. Ensure Core Skills & Technologies exist
        existing_skill = (await db.execute(select(Skill).limit(1))).scalar_one_or_none()
        if not existing_skill:
            skill_names = [
                "Python", "FastAPI", "React", "TypeScript", "SQL", "PostgreSQL",
                "AI/ML", "TensorFlow", "PyTorch", "Docker", "Kubernetes", "Node.js",
                "Tailwind CSS", "Next.js", "Redis", "GraphQL", "AWS", "Flutter",
                "Django", "System Design", "DevOps", "Microservices", "UI/UX Design"
            ]
            for s_name in skill_names:
                skill = Skill(name=s_name, category="Engineering")
                db.add(skill)

            for t_name in skill_names:
                tech = Technology(name=t_name)
                db.add(tech)

            await db.flush()

        # 2. Seed Channels (from Step 26)
        channels_data = [
            ("general", "General discussions, welcome hub, and company news", False),
            ("announcements", "Official announcements & platform releases", False),
            ("development", "Core engineering, architecture, and coding discussions", False),
            ("frontend", "React, TypeScript, UI/UX, styling, and web engineering", False),
            ("backend", "FastAPI, Python, microservices, databases, and APIs", False),
            ("ai-ml", "Autonomous intelligence, LLM pipelines, and machine learning", False),
            ("ui-ux", "Design systems, usability, Figma, and human-computer interaction", False),
            ("devops", "Cloud infrastructure, Kubernetes, CI/CD, and reliability", False),
            ("projects", "Collaboration, project planning, and delivery milestones", False),
        ]
        for name, desc, is_locked in channels_data:
            existing_ch = (await db.execute(select(CommunityChannel).where(CommunityChannel.name == name))).scalar_one_or_none()
            if not existing_ch:
                db.add(CommunityChannel(name=name, description=desc, is_locked=is_locked))
        await db.flush()

        # 3. Ensure Default CompanySettings exist
        existing_settings = (await db.execute(select(CompanySettings).where(CompanySettings.id == 1))).scalar_one_or_none()
        if not existing_settings:
            company_settings = CompanySettings(
                id=1,
                company_name="RMVS Web Services",
                logo_url="/logo.png",
                favicon_url="/logo.png",
                tagline="BUILD • CONNECT • GROW",
                description="Enterprise web architecture, digital platforms, and elite engineering solutions.",
                primary_color="#0066FF",
                secondary_color="#00F2FE",
                email="contact@rmvswebservices.com",
                phone="+91 9400900000",
                whatsapp="+91 9400900000",
                website="https://rmvswebservices.com",
                footer_copyright="© 2026 RMVS Web Services. All rights reserved."
            )
            db.add(company_settings)
            await db.flush()
        else:
            existing_settings.company_name = "RMVS Web Services"
            existing_settings.logo_url = "/logo.png"
            existing_settings.favicon_url = "/logo.png"
            existing_settings.footer_copyright = "© 2026 RMVS Web Services. All rights reserved."
            existing_settings.email = "contact@rmvswebservices.com"
            existing_settings.website = "https://rmvswebservices.com"

        # 4. Ensure CEO account exists
        admin_email = "riteshlingamallu8@gmail.com"
        existing_admin = (await db.execute(select(User).where(User.email == admin_email))).scalar_one_or_none()
        if not existing_admin:
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
                department="Executive Leadership",
                short_bio="Executive Leadership & System Architecture.",
                bio="Leading full-lifecycle software engineering, platform architecture, and enterprise digital solutions.",
                location="India",
                availability="Available for Enterprise Advisory",
                years_experience=5,
                is_public=True,
                skills=admin_skills
            )
            db.add(admin_profile)
            await db.commit()
            print("CEO seeded successfully: riteshlingamallu8@gmail.com")
        else:
            await db.commit()
            print("System schemas, channels, company settings, and CEO verified.")
