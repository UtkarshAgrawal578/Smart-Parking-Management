import numpy as np
import cv2
import json
import os
from ultralytics import YOLO
import cvzone

# ---------------- LOAD MODEL ----------------
model = YOLO(r"C:\Users\RACHIT\Downloads\parking_lot-main\parking_lot-main\best.pt")
names = model.names

# ---------------- VIDEO ----------------
cap = cv2.VideoCapture(r"C:\Users\RACHIT\Downloads\parking_lot-main\parking_lot-main\video1.mp4")
if not cap.isOpened():
    print("❌ Video cannot be opened")
    exit()

# ---------------- POLYGONS ----------------
polygon_points = []
polygons = []
polygon_file = "polygons.json"

# Load polygons safely
if os.path.exists(polygon_file):
    try:
        with open(polygon_file, "r") as f:
            loaded = json.load(f)

        for i, poly in enumerate(loaded):
            if isinstance(poly, list):  # old format
                polygons.append({"id": f"P{i+1}", "points": poly})
            elif isinstance(poly, dict):  # new format
                polygons.append(poly)

    except (json.JSONDecodeError, ValueError):
        print("⚠ polygons.json corrupted, resetting")
        polygons = []

def save_polygons():
    with open(polygon_file, "w") as f:
        json.dump(polygons, f)

def RGB(event, x, y, flags, param):
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
cv2.setMouseCallback("RGB", RGB)


from datetime import datetime  ###TO ADD TIME STAMP

def export_status_json(slot_status, car_count):
    data = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_slots": len(slot_status),
        "free_slots": sum(1 for v in slot_status.values() if v == "EMPTY"),
        "occupied_slots": sum(1 for v in slot_status.values() if v == "FILLED"),
        "cars_detected": car_count,
        "slots": slot_status
    }

    with open("parking_status.json", "w") as f:
        json.dump(data, f, indent=4)


# ---------------- MAIN LOOP ----------------
while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (1020, 500))
    results = model(frame)

    # ---------- INITIALIZE SLOT STATUS ----------
    slot_status = {poly["id"]: "EMPTY" for poly in polygons}
    car_count = 0

    # ---------- UPDATE SLOT STATUS ----------
    if results and results[0].boxes is not None:
        boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)

        for box in boxes:
            car_count += 1

            x1, y1, x2, y2 = box
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)

            for poly in polygons:
                # Correct format for pointPolygonTest → (N,2)
                pts_test = np.array(poly["points"], dtype=np.int32)

                if cv2.pointPolygonTest(pts_test, (cx, cy), False) >= 0:
                    slot_status[poly["id"]] = "FILLED"
                    break

    # ---------- DRAW POLYGONS ----------
    for poly in polygons:
        # Correct format for drawing → (N,1,2)
        pts_draw = np.array(poly["points"], dtype=np.int32).reshape((-1, 1, 2))

        color = (0, 0, 255) if slot_status[poly["id"]] == "FILLED" else (0, 255, 0)
        cv2.polylines(frame, [pts_draw], True, color, 2)

        x, y = poly["points"][0]
        cv2.putText(
            frame,
            poly["id"],
            (x, y - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.45,
            (255, 255, 255),
            1
        )

    # ---------- SIDE PANEL ----------
    y_offset = 60
    for poly in polygons:
        status = slot_status[poly["id"]]
        color = (0, 255, 0) if status == "EMPTY" else (0, 0, 255)

        cv2.putText(
            frame,
            f"{poly['id']} : {status}",
            (820, y_offset),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            color,
            2
        )
        y_offset += 22

    # ---------- COUNTERS ----------
    free_zones = sum(1 for v in slot_status.values() if v == "EMPTY")
    occ_zones = sum(1 for v in slot_status.values() if v == "FILLED")

    cvzone.putTextRect(frame, f"CARS: {car_count}", (30, 40), 2, 2)
    cvzone.putTextRect(frame, f"FREE: {free_zones}", (30, 90), 2, 2)
    cvzone.putTextRect(frame, f"OCC: {occ_zones}", (30, 140), 2, 2)

    export_status_json(slot_status, car_count)   ##ADDED THIS LINE FOR ECPORTING TO JSON FILE 


    # ---------- DRAW IN-PROGRESS POLYGON ----------
    for pt in polygon_points:
        cv2.circle(frame, pt, 5, (0, 0, 255), -1)

    cv2.imshow("RGB", frame)

    key = cv2.waitKey(30) & 0xFF
    if key == 27:
        break
    elif key == ord('r') and polygons:
        polygons.pop()
        save_polygons()
    elif key == ord('c'):
        polygons.clear()
        save_polygons()

cap.release()
cv2.destroyAllWindows()
