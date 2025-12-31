import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Landing() {

  // Scroll fade animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".scroll-fade").forEach(el => observer.observe(el));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">e-Parking Control</h1>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </nav>

        <Link
          to="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Dashboard
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col-reverse md:flex-row items-center px-8 py-16 md:py-24">

        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left scroll-fade opacity-0 translate-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Smart Parking Monitoring System
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Real-time capacity tracking, alert notifications, and detailed logs —
            all from an interactive dashboard.
          </p>

          <div className="mt-6">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center scroll-fade opacity-0 translate-y-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
            alt="Parking"
            className="w-64 md:w-96"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-8 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center text-gray-800 scroll-fade opacity-0 translate-y-6">
          Key Features
        </h3>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            { title: "🔴 Live Count", desc: "Track real-time parking occupancy instantly." },
            { title: "⚠ Alert System", desc: "Get auto alerts when capacity limits are reached." },
            { title: "📄 Logs History", desc: "View timestamped entry/exit parking logs." }
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition scroll-fade opacity-0 translate-y-6"
            >
              <h4 className="text-xl font-semibold mb-2 text-gray-900">
                {f.title}
              </h4>
              <p className="text-gray-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="px-8 py-16 scroll-fade opacity-0 translate-y-6">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          About the System
        </h3>

        <p className="text-gray-600 text-center mt-4 max-w-3xl mx-auto">
         This platform is built for Municipal Corporations like MCD to ensure transparent and accountable parking management. It provides a real-time, tamper-proof system that tracks parking capacity accurately, prevents overparking by contractors, and enforces contractual limits.

By delivering live occupancy data, secure records, and automated alerts, the solution reduces congestion, stops misuse, and improves operational efficiency. Our goal is to support smarter, technology-driven governance and create a more organized parking experience for the city.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="px-8 py-16 scroll-fade opacity-0 translate-y-6">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          Contact Us
        </h3>
        <p className="text-center text-gray-600 mt-4">
          For collaborations, support, or project inquiries:
        </p>
        <p className="text-center text-blue-600 font-semibold text-lg mt-2">
          support@smartparking.com
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-6 text-center mt-10">
        <p className="text-sm">
          © {new Date().getFullYear()} e-Parking Control — All Rights Reserved.
        </p>
      </footer>

      {/* Scroll Animation CSS */}
      <style>{`
        .scroll-fade {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out;
        }
        .scroll-fade.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
