import React from "react";

export default function LiveCountCard({ count, capacity }) {
  const percentage = (count / capacity) * 100;

  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-2">Live Parking Count</h2>
      <p className="text-4xl font-bold mb-4">{count} / {capacity}</p>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${percentage > 100 ? "bg-red-600" : "bg-green-500"}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
