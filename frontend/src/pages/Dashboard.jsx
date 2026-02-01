import React, { useEffect, useState } from "react";
import { getStatus } from "../services/api";
import LiveCountCard from "../components/LiveCountCard";
import AlertBox from "../components/AlertBox";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

export default function Dashboard() {
  const [status, setStatus] = useState({
    free: 0,
    occupied: 0,
    cars: 0,
    slots: {},
  });

  useEffect(() => {
    const interval = setInterval(() => {
      getStatus().then((res) => setStatus(res.data));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        {/* 🔴 ALERT AT TOP */}
        <div className="alert-row">
          <AlertBox show={status.occupied > status.free} />
        </div>

        {/* 🎥 VIDEO + 📊 STATS SIDE BY SIDE */}
        <div className="top-row">
          <div className="video-section">
            <h2 className="section-title">Live Parking Feed</h2>
            <div className="video-card">
              <img
                src="http://localhost:8000/api/video"
                alt="Live feed"
                className="video-frame"
              />
            </div>
          </div>

          <div className="stats-section">
            <h2 className="section-title">Live Overview</h2>
            <div className="stats-grid">
              <LiveCountCard title="Cars Detected" value={status.cars} variant="blue" />
              <LiveCountCard title="Free Slots" value={status.free} variant="green" />
              <LiveCountCard title="Occupied Slots" value={status.occupied} variant="red" />
            </div>
          </div>
        </div>

        {/* 🅿️ SLOT STATUS BELOW */}
        <div className="slots-section dark-slots">
          <h2 className="section-title">Slot Status</h2>
          <div className="slot-grid">
            {Object.entries(status.slots).map(([slot, stat]) => (
              <div
                key={slot}
                className={`slot-card ${stat === "FILLED" ? "slot-filled" : "slot-empty"}`}
              >
                <span className="slot-name">{slot}</span>
                <span className="slot-state">{stat}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
