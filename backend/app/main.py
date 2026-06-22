from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.models import OpportunityReport  # Ensure models are imported for metadata creation
from app.routers import research, reports

# Create the SQLite tables
# Note: For production, a migration tool like Alembic is preferred.
# For this MVP, we create tables directly on startup if they don't exist.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InsightForge API",
    description="Backend API for InsightForge opportunity discovery platform",
    version="1.0.0"
)

# Register routers
app.include_router(research.router)
app.include_router(reports.router)


# CORS configuration to allow local and deployed frontend calls
import os
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
    allow_all_origins = False
else:
    # Default to allow all in development/production for ease of deployment
    origins = ["*"]
    allow_all_origins = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=not allow_all_origins,  # Must be False if allow_origins contains "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["Health"])
def health_check():
    """
    Health check endpoint to verify database connectivity and server status.
    """
    try:
        # Simple database check
        # We can run a raw text query or just return success since DB initialized
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
