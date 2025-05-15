# backend/Discord_Builders/backend/schemas/request.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ServerRequestCreate(BaseModel):
    company_name: str
    details: str

class ServerRequestResponse(BaseModel):
    id: str
    company_name: str
    details: str
    user_uid: str
    builder_uid: str | None
    status: str| None
    is_accepted: bool
    created_at: datetime

    class Config:
        orm_mode = True
