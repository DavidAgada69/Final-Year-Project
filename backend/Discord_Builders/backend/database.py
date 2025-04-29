from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# --- Database URL (adjust if needed) ---
DATABASE_URL = "postgresql://postgres:Database1@localhost:5432/Discord_Office_Builder"

# --- Create Engine, Session, and Base ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# === Dependency: Get DB Session ===
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()