import React from "react";

export default function Navbar() {
  return (
    // <nav className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
    <nav className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 text-white shadow-xl">

      {/* Glow */}
      <div className="absolute inset-0 opacity-20 blur-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400" />

      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur text-xl font-bold shadow">
            🚗
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">
              Smart Parking
            </h1>
            <p className="text-xs text-white/80 tracking-widest">
              LIVE DASHBOARD
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center space-x-6">
          <span className="text-sm font-medium text-white/90">
            Real-Time Monitoring
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>
    </nav>
  );
}
