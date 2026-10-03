import asyncio
import sys
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine, Base
from app.db.seed import seed_data

async def test_connection():
    print(f"Loaded DATABASE_URL: {settings.DATABASE_URL[:40]}...", flush=True)
    is_sqlite = "sqlite" in settings.DATABASE_URL
    print(f"Database Type: {'SQLite' if is_sqlite else 'Neon PostgreSQL'}", flush=True)
    
    try:
        print("Opening connection...", flush=True)
        async with engine.connect() as conn:
            print("Executing SELECT 1...", flush=True)
            result = await conn.execute(text("SELECT 1;"))
            val = result.scalar()
            print(f"[OK] Basic Query Result: {val}", flush=True)

            if not is_sqlite:
                print("Executing SELECT version()...", flush=True)
                ver = await conn.execute(text("SELECT version();"))
                print(f"[OK] PostgreSQL Engine Version: {ver.scalar()}", flush=True)

        # Verify tables exist
        print("Checking tables on database...", flush=True)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[OK] All tables verified on Neon PostgreSQL!", flush=True)

        # Run seed
        print("Verifying initial seed state...", flush=True)
        await seed_data()
        print("[OK] Database ready for RMVS Web Services!", flush=True)

    except Exception as e:
        print(f"\n[ERROR] Connection Error: {e}", file=sys.stderr, flush=True)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_connection())
