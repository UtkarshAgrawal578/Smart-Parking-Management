from pydantic import BaseModel, EmailStr
from auth.database import db

class SignupModel(BaseModel):
    name: str
    email: EmailStr
    employee_id: str
    password: str
    department: str | None = None

class LoginModel(BaseModel):
    email: EmailStr
    password: str
