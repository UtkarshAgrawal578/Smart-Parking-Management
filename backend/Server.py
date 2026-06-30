from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
import cv2
import numpy as np
import json
import os
from datetime import datetime

# ================= ROUTER =================
router = APIRouter(prefix="/api", tags=["YOLO"])

# ================= LOAD MODEL =================
MODEL_PATH = r"C:\Users\ASUS\OneDrive\Desktop\SmartParking\backend\best.pt"
model = YOLO(MODEL_PATH)

# ================= VIDEO =================
VIDEO_PATH = r"C:\Users\ASUS\OneDrive\Desktop\SmartParking\backend\video1.mp4"
cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    raise RuntimeError("❌ Video cannot be opened")

# ================= POLYGONS =================
polygon_file = "polygons.json"
polygons = []

if os.path.exists(polygon_file):
    with open(polygon_file, "r") as f:
        loaded = json.load(f)

    for poly in loaded:
        # Validate polygon structure
        if (
            isinstance(poly, dict)
            and "id" in poly
            and isinstance(poly.get("points"), list)
            and len(poly["points"]) >= 3
        ):
            polygons.append(poly)

# ================= GLOBAL STATUS =================
latest_status = {
    "timestamp": None,
    "cars": 0,
    "free": 0,
    "occupied": 0,
    "slots": {}
}

# ================= FRAME GENERATOR =================
def generate_frames():
    global latest_status

    last_frame = None  # store last valid frame

    while True:
        ret, frame = cap.read()

        # ---------------- VIDEO ENDED → FREEZE ----------------
        if not ret:
            if last_frame is None:
                continue  # nothing to show yet

            success, buffer = cv2.imencode(".jpg", last_frame)
            if not success:
                continue  # encoding failed, try again

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + buffer.tobytes()
                + b"\r\n"
            )
            continue

        # ---------------- NORMAL FRAME ----------------
        frame = cv2.resize(frame, (1020, 500))
        last_frame = frame.copy()  # ✅ GUARANTEED valid

        results = model(frame, verbose=False)

        slot_status = {poly["id"]: "EMPTY" for poly in polygons}
        car_count = 0

        if results and results[0].boxes is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)

            for x1, y1, x2, y2 in boxes:
                car_count += 1
                cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

                for poly in polygons:
                    pts = np.array(
                        poly["points"], dtype=np.int32
                    ).reshape((-1, 1, 2))
                    pts = np.ascontiguousarray(pts)

                    if cv2.pointPolygonTest(pts, (int(cx), int(cy)), False) >= 0:
                        slot_status[poly["id"]] = "FILLED"
                        break

        free_zones = sum(v == "EMPTY" for v in slot_status.values())
        occ_zones = sum(v == "FILLED" for v in slot_status.values())

        latest_status = {
            "timestamp": datetime.now().isoformat(),
            "cars": car_count,
            "free": free_zones,
            "occupied": occ_zones,
            "slots": slot_status
        }

        # ---------------- DRAW POLYGONS ----------------
        for poly in polygons:
            pts = np.array(
                poly["points"], dtype=np.int32
            ).reshape((-1, 1, 2))
            pts = np.ascontiguousarray(pts)

            color = (0, 0, 255) if slot_status[poly["id"]] == "FILLED" else (0, 255, 0)
            cv2.polylines(frame, [pts], True, color, 2)

        # ---------------- SEND FRAME ----------------
        success, buffer = cv2.imencode(".jpg", frame)
        if not success:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + buffer.tobytes()
            + b"\r\n"
        )


# ================= API =================
@router.get("/video")
def video_feed():
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
@router.get("/status")
def get_status():
    return latest_status

