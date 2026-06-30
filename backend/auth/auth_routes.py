from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import datetime, timedelta
import os
import bcrypt

from auth.database import mcd_users
from auth.models import SignupModel, LoginModel

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET")
ALGO = os.getenv("JWT_ALGO")


# ---------- SIGNUP ----------
@router.post("/signup")
def signup(data: SignupModel):
    # check if email exists
    if mcd_users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password safely
    hashed_pw = bcrypt.hashpw(
        data.password.encode("utf-8"),
        bcrypt.gensalt()
    )

    user = {
        "name": data.name,
        "email": data.email,
        "employee_id": data.employee_id,
        "department": data.department,
        "password": hashed_pw,   # store hashed bytes
        "role": "MCD_OFFICER",
        "createdAt": datetime.utcnow()
    }

    mcd_users.insert_one(user)
    return {"message": "Signup successful"}


# ---------- LOGIN ----------
@router.post("/login")
def login(data: LoginModel):
    user = mcd_users.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    if not bcrypt.checkpw(
        data.password.encode("utf-8"),
        user["password"]
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=12)
    }, JWT_SECRET, algorithm=ALGO)

    return {"token": token, "name": user["name"]}
