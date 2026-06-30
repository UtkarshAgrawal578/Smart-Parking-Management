from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.auth_routes import router as auth_router
from Server import router as yolo_router   # 👈 ADD THIS

app = FastAPI(title="Smart Parking Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Include routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(yolo_router)   # 👈 ADD THIS

@app.get("/")
def root():
    return {"message": "Smart Parking Backend Running"}
