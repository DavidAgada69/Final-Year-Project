from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user import User
from backend.utils.firebase import auth as firebase_auth

router = APIRouter()

@router.get("/me")
def get_me(Authorization: str = Header(...), db: Session = Depends(get_db)):
    print("Authorization header received:", Authorization)
    
    try:
        id_token = Authorization.split(" ")[1]
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired Firebase token")

    user = db.query(User).filter(User.uid == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "uid": user.uid,
        "email": user.email,
        "username": user.username,
        "role": user.role,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }
