from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
import cv2
import numpy as np
import json
import os
from datetime import datetime
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


# ---------------- APP ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- LOAD MODEL ----------------
model = YOLO(
    r"C:\Users\ASUS\OneDrive\Desktop\SmartParking\backend\best.pt")

# ---------------- VIDEO ----------------
cap = cv2.VideoCapture(
    r"C:\Users\ASUS\OneDrive\Desktop\SmartParking\backend\video1.mp4")
if not cap.isOpened():
    raise RuntimeError("❌ Video cannot be opened")

# ---------------- POLYGONS ----------------
polygon_points = []
polygons = []
polygon_file = "polygons.json"

if os.path.exists(polygon_file):
    try:
        with open(polygon_file, "r") as f:
            loaded = json.load(f)

        for i, poly in enumerate(loaded):
            if isinstance(poly, list):
                polygons.append({"id": f"P{i+1}", "points": poly})
            elif isinstance(poly, dict):
                polygons.append(poly)
    except:
        polygons = []


def save_polygons():
    with open(polygon_file, "w") as f:
        json.dump(polygons, f)


# ---------------- GLOBAL STATUS ----------------
latest_status = {
    "timestamp": None,
    "cars": 0,
    "free": 0,
    "occupied": 0,
    "slots": {}
}


# ---------------- FRAME GENERATOR ----------------
def generate_frames():
    global latest_status

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (1020, 500))
        results = model(frame, verbose=False)

        slot_status = {poly["id"]: "EMPTY" for poly in polygons}
        car_count = 0

        if results and results[0].boxes is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)

            for box in boxes:
                car_count += 1
                x1, y1, x2, y2 = box
                cx, cy = int((x1 + x2) / 2), int((y1 + y2) / 2)

                for poly in polygons:
                    pts = np.array(poly["points"], dtype=np.int32)
                    if cv2.pointPolygonTest(pts, (cx, cy), False) >= 0:
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

        # -------- DRAW OVERLAY --------
        for poly in polygons:
            pts = np.array(poly["points"], dtype=np.int32).reshape((-1, 1, 2))
            color = (0, 0, 255) if slot_status[poly["id"]] == "FILLED" else (
                0, 255, 0)
            cv2.polylines(frame, [pts], True, color, 2)

        cv2.putText(frame, f"CARS: {car_count}", (30, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"FREE: {free_zones}", (30, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, f"OCC: {occ_zones}", (30, 120),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        _, buffer = cv2.imencode(".jpg", frame)
        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")


# ---------------- API ----------------
@app.get("/api/status")
def get_status():
    return latest_status


@app.get("/api/video")
def video_feed():
    return StreamingResponse(generate_frames(),
                             media_type="multipart/x-mixed-replace; boundary=frame")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Server:app", host="0.0.0.0", port=8000, reload=True)
