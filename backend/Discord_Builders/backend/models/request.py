# backend/Discord_Builders/backend/models/request.py
from sqlalchemy import Column, String, DateTime, Text, Boolean
from datetime import datetime
import uuid

from backend.database import Base

class ServerRequest(Base):
    __tablename__ = "server_requests"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_name = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    user_uid = Column(String, nullable=False)
    builder_uid = Column(String, nullable=True)
    status = Column(String, nullable=True)  # Add to track "working", "complete"

    is_accepted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
