"""
SWASTLOK — Backend Service
FastAPI Single Monolithic Backend
Team Synaptix | Smart India Hackathon 2026
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SWASTLOK Clinical Intelligence API",
    version="1.0.0",
    description="Backend service for SWASTLOK OPD Kiosk & Doctor Portal"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Swastlok Clinical Backend",
        "version": "1.0.0",
        "mode": "PROTOTYPE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
