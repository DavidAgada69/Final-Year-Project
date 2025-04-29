from pydantic import BaseModel

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    id_token: str
