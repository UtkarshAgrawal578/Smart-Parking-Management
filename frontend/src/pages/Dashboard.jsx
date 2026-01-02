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
      getStatus().then((res) => setStatus({ ...res.data }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("Status updated:", status);
  }, [status]);

  const slotList = document.getElementById("slotList");

  const ul = document.createElement("ul");

  return (
    <>
      <Navbar />
      <div className="p-6 grid grid-cols-3 gap-4">
        {/* Video */}
        <div className="rounded shadow overflow-hidden">
          <img
            src="http://localhost:8000/api/video"
            alt="Live feed"
            className="w-full"
          />
        </div>

        <div className="space-y-4">
  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
    Live Parking Status
  </h2>

  <LiveCountCard title="Cars" value={status.cars} />
  <LiveCountCard title="Free Slots" value={status.free} />
  <LiveCountCard title="Occupied Slots" value={status.occupied} />

  <AlertBox show={status.occupied > (status.free + status.occupied)} />
</div>
 
        <div id="slotList" className="slot-grid space-y-4">
  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
    Filled and Empty Slots
  </h2>

  {Object.entries(status.slots).map(([slot, stat]) => (
    <div
      key={slot}
      className={`slot-card ${stat === "FILLED" ? "filled" : "empty"}`}
    >
      <span className="slot-name">{slot}</span>
      <span className="slot-status">{stat}</span>
    </div>
  ))}
</div>

      </div>
    </>
  );
}
