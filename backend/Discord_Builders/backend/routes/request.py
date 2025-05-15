# routes/request.py

from fastapi import APIRouter, Depends, Request, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.request import ServerRequest
from backend.models.user import User
from backend.schemas.request import ServerRequestCreate
from backend.schemas.request import ServerRequestResponse
from backend.utils.firebase import firebase_auth

import uuid

router = APIRouter(prefix="/api", tags=["Request"])

# === Submit a New Server Request ===
@router.post("/request")
async def submit_server_request(
    request_data: ServerRequestCreate,
    db: Session = Depends(get_db),
    Authorization: str = Header(...)
):
    token = Authorization.split("Bearer ")[-1]
    decoded_token = firebase_auth.verify_id_token(token)
    user_uid = decoded_token.get("user_id")

    new_request = ServerRequest(
        id=str(uuid.uuid4()),
        user_uid=user_uid,
        company_name=request_data.company_name,
        details=request_data.details,
        status="unaccepted"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request

# === View Requests (Client & Builder Roles) ===
@router.get("/requests", response_model=List[ServerRequestResponse])
def get_open_requests(
    request: Request,
    db: Session = Depends(get_db)
):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    id_token = auth_header.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        user_uid = decoded_token["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired Firebase token")

    user = db.query(User).filter(User.uid == user_uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "builder":
        open_requests = db.query(ServerRequest).filter(ServerRequest.is_accepted == False).all()
        return open_requests

    elif user.role == "client":
        own_requests = db.query(ServerRequest).filter(ServerRequest.user_uid == user_uid).all()
        return own_requests

    else:
        raise HTTPException(status_code=403, detail="Invalid user role")

# === Accept a Server Request (Builder only) ===
@router.patch("/requests/{request_id}/accept")
async def accept_server_request(
    request_id: str,
    db: Session = Depends(get_db),
    Authorization: str = Header(...)
):
    token = Authorization.split("Bearer ")[-1]
    decoded_token = firebase_auth.verify_id_token(token)
    user_uid = decoded_token.get("user_id")

    user = db.query(User).filter(User.uid == user_uid).first()
    if not user or user.role != "builder":
        raise HTTPException(status_code=403, detail="Only builders can accept requests.")

    server_request = db.query(ServerRequest).filter(ServerRequest.id == request_id).first()
    if not server_request:
        raise HTTPException(status_code=404, detail="Request not found.")
    if server_request.is_accepted:
        raise HTTPException(status_code=400, detail="Request already accepted.")

    server_request.is_accepted = True
    server_request.status = "unaccepted"
    server_request.builder_uid = user_uid
    db.commit()

    return {"message": "Request accepted successfully."}

# === Update request status(Only assigned builder) ===
@router.patch("/requests/{request_id}/status")
async def update_request_status(
    request_id: str,
    request_data: dict,
    db: Session = Depends(get_db),
    Authorization: str = Header(...)
):
    token = Authorization.split("Bearer ")[-1]
    decoded_token = firebase_auth.verify_id_token(token)
    user_uid = decoded_token.get("user_id")

    # Check builder
    user = db.query(User).filter(User.uid == user_uid).first()
    if not user or user.role != "builder":
        raise HTTPException(status_code=403, detail="Only builders can update request status.")

    server_request = db.query(ServerRequest).filter(ServerRequest.id == request_id).first()
    if not server_request:
        raise HTTPException(status_code=404, detail="Request not found.")

    if not server_request.is_accepted:
        raise HTTPException(status_code=400, detail="Request has not been accepted yet.")

    # Update status
    new_status = request_data.get("status")
    if new_status not in ["working", "complete"]:
        raise HTTPException(status_code=400, detail="Invalid status value.")

    server_request.status = new_status
    db.commit()

    return {"message": f"Request marked as {new_status}."}

# === Drop accepted requests === (for builders) ===
@router.patch("/requests/{request_id}/drop")
async def drop_request(
    request_id: str,
    db: Session = Depends(get_db),
    Authorization: str = Header(...)
):
    token = Authorization.split("Bearer ")[-1]
    decoded_token = firebase_auth.verify_id_token(token)
    user_uid = decoded_token.get("user_id")

    user = db.query(User).filter(User.uid == user_uid).first()
    if not user or user.role != "builder":
        raise HTTPException(status_code=403, detail="Only builders can drop requests.")

    server_request = db.query(ServerRequest).filter(ServerRequest.id == request_id).first()
    if not server_request:
        raise HTTPException(status_code=404, detail="Request not found.")

    if not server_request.is_accepted:
        raise HTTPException(status_code=400, detail="Request is already unaccepted.")

    # Reset status and assignment
    server_request.is_accepted = False
    server_request.status = "unaccepted"
    db.commit()

    return {"message": "Request dropped and returned to unaccepted pool."}
