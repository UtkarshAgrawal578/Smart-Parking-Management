import React from "react";
import { AlertTriangle } from "lucide-react"; // optional icon library

export default function AlertBox({ show }) {
  if (!show) return null;

  return (
    <div className="w-full">
      <div
        className="
          bg-gradient-to-r from-red-600 to-red-500 
          text-white 
          p-4 
          rounded-xl 
          mt-4 
          shadow-lg 
          flex 
          items-center 
          gap-3
          animate-[fadeIn_0.4s_ease-out]
        "
      >
        <div className="bg-white/20 p-2 rounded-full">
          <AlertTriangle size={22} className="text-white" />
        </div>

        <p className="font-semibold text-lg tracking-wide">
          Parking Over Capacity!
        </p>
      </div>

      {/* Custom keyframe for fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
