import cv2
import json
import os
import numpy as np
polygon_points = []
polygons = []
polygon_file = "polygons.json"

cap = cv2.VideoCapture(
    r"D:\Smart-Parking-Management\Smart-Parking-Management\backend\video1.mp4")
ret, frame = cap.read()
frame = cv2.resize(frame, (1020, 500))


def save():
    with open(polygon_file, "w") as f:
        json.dump(polygons, f, indent=4)


def mouse(event, x, y, flags, param):
    global polygon_points, polygons
    if event == cv2.EVENT_LBUTTONDOWN:
        polygon_points.append([x, y])
        if len(polygon_points) == 4:
            polygons.append({"id": f"P{len(polygons)+1}",
                            "points": polygon_points.copy()})
            polygon_points.clear()
            save()


cv2.namedWindow("Draw Slots")
cv2.setMouseCallback("Draw Slots", mouse)

while True:
    temp = frame.copy()

    for poly in polygons:
        pts = cv2.convexHull(
            np.array(poly["points"], dtype=np.int32).reshape(-1, 1, 2))
        cv2.polylines(temp, [pts], True, (0, 255, 0), 2)
        x, y = poly["points"][0]
        cv2.putText(temp, poly["id"], (x, y-5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    for pt in polygon_points:
        cv2.circle(temp, tuple(pt), 5, (0, 0, 255), -1)

    cv2.imshow("Draw Slots", temp)
    key = cv2.waitKey(30) & 0xFF

    if key == 27:
        break
    elif key == ord("r") and polygons:
        polygons.pop()
        save()
    elif key == ord("c"):
        polygons.clear()
        save()

cv2.destroyAllWindows()
