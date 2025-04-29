from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..schemas.auth import RegisterRequest, LoginRequest
from ..models.user import User
from ..database import get_db
from firebase_admin import auth as firebase_auth

router = APIRouter()

# Register a new User
@router.post("/register")
async def register_user(request: RegisterRequest):
    try:
        user = firebase_auth.create_user(
            email=request.email,
            password=request.password
        )
        return {"message": f"Successfully created user: {user.uid}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Login User
@router.post("/login")
async def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        decoded_token = firebase_auth.verify_id_token(request.id_token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email", "")

        # Check if user already exists
        user = db.query(User).filter(User.uid == uid).first()

        if not user:
            new_user = User(uid=uid, email=email)
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

        return {"message": f"Login successful. User ID: {uid}"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
