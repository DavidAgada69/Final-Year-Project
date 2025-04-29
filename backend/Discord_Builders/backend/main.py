from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import auth
from .utils import firebase

# --- Create database tables ---
Base.metadata.create_all(bind=engine)

# --- Initialize FastAPI ---
app = FastAPI()

# --- Setup CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include API Routers ---
app.include_router(auth.router)
