from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import access, climate, it, auth
from .models import Base
from .database import engine

app = FastAPI(title="Unified Smart Facility Management Platform (USFMP)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth.router)
app.include_router(access.router)
app.include_router(climate.router)
app.include_router(it.router)

@app.get("/")
def root():
    return {"message": "USFMP API running"}
