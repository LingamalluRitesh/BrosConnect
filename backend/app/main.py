from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.api.websockets.routes import ws_router
from app.db.seed import seed_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seed initial platform state
    print("RMVS Web Services Backend starting up... checking database & seeds.")
    try:
        await seed_data()
    except Exception as e:
        print(f"Seed notice: {e}")
    yield
    print("RMVS Web Services Backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(ws_router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "leadership": {
            "ceo": settings.SUPER_ADMIN_NAME
        }
    }

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }
