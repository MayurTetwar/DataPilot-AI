from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, jobs


# ─────────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────────

app = FastAPI(
    title="Autonomous Data Engineering Agent",
    description="Upload a messy dataset, get a clean one back — automatically.",
    version="1.0.0"
)


# ─────────────────────────────────────────────
# CORS — allows the React frontend to call this
# ─────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Routers
# ─────────────────────────────────────────────

app.include_router(upload.router, tags=["Upload"])
app.include_router(jobs.router, tags=["Jobs"])


# ─────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def health_check():
    return {
        "status": "running",
        "project": "Autonomous Data Engineering Agent",
        "version": "1.0.0"
    }