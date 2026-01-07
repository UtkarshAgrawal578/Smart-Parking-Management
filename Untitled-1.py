

import cv2
import numpy as np
import json
import os
from ultralytics import YOLO
import cvzone
from datetime import datetime

# ===================== LOAD MODELS =====================
model_top = YOLO(r"C:\Users\RACHIT\Desktop\Web Dev\parking_lot-main\parking_lot-main\best.pt")        # Top-view model
model_side = YOLO(r"C:\Users\RACHIT\Desktop\Web Dev\parking_lot-main\parking_lot-main\yolov8n.pt")    # Side/front-view model

VEHICLE_CLASSES = [2, 3, 5, 7]  # car, motorcycle, bus, truck (YOLOv8)

# ===================== VIDEO =====================
#video_path = r"C:\Users\RACHIT\Desktop\Web Dev\parking_lot-main\parking_lot-main\video4 (1).mp4"   
#video_path = r"C:\Users\RACHIT\Desktop\Web Dev\parking_lot-main\parking_lot-main\video1.mp4"
video_path = r"C:\Users\RACHIT\Desktop\Web Dev\parking_lot-main\parking_lot-main\parking_crop.mp4"

cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("❌ Cannot open video")
    exit()

# ===================== POLYGONS =====================
polygon_points = []
polygons = []

video_name = os.path.splitext(os.path.basename(video_path))[0]
polygon_file = f"polygons_{video_name}.json"

if os.path.exists(polygon_file):
    with open(polygon_file, "r") as f:
        loaded = json.load(f)
        for i, poly in enumerate(loaded):
            if isinstance(poly, list):
                polygons.append({"id": f"P{i+1}", "points": poly})
            else:
                polygons.append(poly)

def save_polygons():
    with open(polygon_file, "w") as f:
        json.dump(polygons, f, indent=4)

def mouse_event(event, x, y, flags, param):
    global polygon_points, polygons
    if event == cv2.EVENT_LBUTTONDOWN:
        polygon_points.append((int(x), int(y)))
        if len(polygon_points) == 4:
            polygons.append({
                "id": f"P{len(polygons)+1}",
                "points": polygon_points.copy()
            })
            save_polygons()
            polygon_points.clear()

cv2.namedWindow("RGB")
cv2.setMouseCallback("RGB", mouse_event)

# ===================== JSON EXPORT =====================
def export_status_json(slot_status, car_count):
    data = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_slots": len(slot_status),
        "free_slots": list(slot_status.values()).count("EMPTY"),
        "occupied_slots": list(slot_status.values()).count("FILLED"),
        "cars_detected": car_count,
        "slots": slot_status
    }
    with open("parking_status.json", "w") as f:
        json.dump(data, f, indent=4)

# ===================== MAIN LOOP =====================
while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (1500, 800))

    # Run both models
    results_top = model_top(frame)
    results_side = model_side(frame)

    # Initialize slot status
    slot_status = {poly["id"]: "EMPTY" for poly in polygons}
    car_count = 0

    # ---------- PROCESS TOP VIEW MODEL ----------
    if results_top and results_top[0].boxes is not None:
        boxes = results_top[0].boxes.xyxy.cpu().numpy().astype(int)

        for box in boxes:
            car_count += 1
            x1, y1, x2, y2 = box
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2

            for poly in polygons:
                pts = np.array(poly["points"], dtype=np.int32).reshape((-1, 2))

                if cv2.pointPolygonTest(pts, (int(cx), int(cy)), False) >= 0:
                    slot_status[poly["id"]] = "FILLED"
                    break

    # ---------- PROCESS SIDE / FRONT MODEL ----------
    if results_side and results_side[0].boxes is not None:
        boxes = results_side[0].boxes.xyxy.cpu().numpy().astype(int)
        cls_ids = results_side[0].boxes.cls.cpu().numpy().astype(int)

        for box, cls_id in zip(boxes, cls_ids):
            if cls_id not in VEHICLE_CLASSES:
                continue

            car_count += 1
            x1, y1, x2, y2 = box
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2

            for poly in polygons:
                pts = np.array(poly["points"], dtype=np.int32).reshape((-1,2))

                if cv2.pointPolygonTest(pts, (int(cx), int(cy)), False) >= 0:
                    slot_status[poly["id"]] = "FILLED"
                    break

    # ---------- DRAW POLYGONS ----------
    for poly in polygons:
        pts_draw = np.array(poly["points"], dtype=np.int32).reshape((-1, 1, 2))
        color = (0, 0, 255) if slot_status[poly["id"]] == "FILLED" else (0, 255, 0)

        cv2.polylines(frame, [pts_draw], True, color, 2)

        x, y = poly["points"][0]
        cv2.putText(
            frame,
            poly["id"],
            (x, y - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

    # ---------- SIDE PANEL ----------
    # panel_x = frame.shape[1] - 260
    y_offset = 20

    for poly in polygons:
        status = slot_status[poly["id"]]
        color = (0, 255, 0) if status == "EMPTY" else (0, 0, 255)

        cv2.putText(
            frame,
            f"{poly['id']} : {status}",
            (1230, y_offset),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            color,
            2
        )
        y_offset += 22

    # ---------- COUNTERS ----------
    free_slots = list(slot_status.values()).count("EMPTY")
    occ_slots = list(slot_status.values()).count("FILLED")

    cvzone.putTextRect(frame, f"CARS: {car_count}", (30, 40), 2, 2)
    cvzone.putTextRect(frame, f"FREE: {free_slots}", (30, 90), 2, 2)
    cvzone.putTextRect(frame, f"OCC: {occ_slots}", (30, 140), 2, 2)

    # Export JSON
    export_status_json(slot_status, car_count)

    # Draw in-progress polygon points
    for pt in polygon_points:
        cv2.circle(frame, pt, 5, (0, 0, 255), -1)

    cv2.imshow("RGB", frame)

    key = cv2.waitKey(80) & 0xFF
    if key == 27:        # ESC
        break
    elif key == ord('r') and polygons:
        polygons.pop()
        save_polygons()
    elif key == ord('c'):
        polygons.clear()
        save_polygons()

cap.release()
cv2.destroyAllWindows()
