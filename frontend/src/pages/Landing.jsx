import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import parkingAnim from "../assets/parkingAnim.json";
import { MdOutlineLocalParking } from "react-icons/md";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { AiOutlineFileProtect } from "react-icons/ai";

export default function Landing() {

  // Scroll reveal
useEffect(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  document
    .querySelectorAll(".reveal, .bg-anim")
    .forEach(el => observer.observe(el));
}, []);


  return (
    <div className="bg-slate-900 text-gray-200 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-teal-400">
            Civic Parking Oversight System
          </h1>

          <nav className="hidden md:flex gap-8 text-gray-300">
            <a href="#features" className="hover:text-teal-400 transition">Capabilities</a>
            <a href="#about" className="hover:text-teal-400 transition">Overview</a>
            <a href="#contact" className="hover:text-teal-400 transition">Contact</a>
            <style>{`
  html {
    scroll-behavior: smooth;
  }
`}</style>
          </nav>

          <Link
            to="/dashboard"
            className="px-5 py-2 bg-teal-500 text-slate-900 rounded-md font-semibold hover:bg-teal-400 transition"
          >
            Dashboard
          </Link>
        </div>
      </header>

      
      {/* ================= HERO WITH ANIMATION ================= */}
<section className="relative w-screen h-[90vh] bg-slate-900 overflow-hidden">

  {/* ===== FULL WIDTH BACKGROUND ANIMATION ===== */}
  <div className="absolute inset-0 w-full h-full z-0 bg-anim">
    <Lottie
      animationData={parkingAnim}
      loop
      speed={0.9}
      className="w-full h-full opacity-100"
      rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
    />
  </div>

  {/* ===== DARK OVERLAY ===== */}
  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/40 z-10" />

  {/* ===== TEXT CONTENT ===== */}
  <div className="relative z-20 h-full flex items-center">
    <div className="w-full px-6 md:px-16 lg:px-24">
      <div className="max-w-3xl reveal">

        <h2 className="text-4xl md:text-6xl font-bold leading-tight text-gray-100">
          Smart Urban <br />
          <span className="text-teal-400">Parking Governance</span>
        </h2>

        <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
          A centralized digital platform enabling Municipal Corporations
          to monitor parking capacity, prevent violations, and ensure
          transparent and regulation-compliant operations.
        </p>

        <div className="mt-10">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-teal-500 text-slate-900 rounded-md text-lg font-semibold hover:bg-teal-400 transition"
          >
            Enter Control Panel
          </Link>
        </div>

      </div>
    </div>
  </div>

  {/* ===== COMPONENT-LOCAL STYLES ===== */}
  <style>{`
    /* TEXT REVEAL */
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: all 1s ease;
    }

    .reveal.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* BACKGROUND ANIMATION TRANSITION */
    .bg-anim {
      opacity: 0;
      transform: scale(1.05);
      transition: opacity 1.8s ease, transform 2.5s ease;
    }

    .bg-anim.show {
      opacity: 1;
      transform: scale(1);
    }
  `}</style>

</section>
<section id="about" className="bg-slate-900">
  <div className="max-w-5xl mx-auto px-8 py-28">

    <h3 className="text-4xl md:text-5xl font-bold text-center text-gray-100 mb-12 reveal">
      About the Platform
    </h3>

    <div className="space-y-10 reveal">

      <p className="text-xl md:text-2xl text-gray-300 leading-relaxed text-center">
        The Smart Urban Parking Governance Platform is a centralized digital
        solution developed to assist Municipal Corporations in regulating,
        monitoring, and enforcing parking operations across urban areas.
      </p>

      <p className="text-xl md:text-2xl text-gray-300 leading-relaxed text-center">
        By providing real-time visibility into parking occupancy, automated
        compliance alerts, and secure digital records, the system ensures
        transparency, accountability, and adherence to approved parking
        capacity norms.
      </p>

      <p className="text-xl md:text-2xl text-gray-300 leading-relaxed text-center">
        The platform supports data-driven governance, reduces congestion,
        prevents misuse by parking operators, and enables city authorities
        to improve operational efficiency while enhancing the overall
        urban mobility experience.
      </p>

    </div>
  </div>
</section>


      {/* ================= FEATURES ================= */}
      
<section id="features" className="bg-slate-950">
  <div className="max-w-7xl mx-auto px-8 py-24">

    <h3 className="text-3xl font-bold text-center mb-16 reveal">
      System Capabilities
    </h3>

    <div className="grid md:grid-cols-3 gap-12">

      {/* CARD 1 */}
      <div className="feature-card reveal">
        <div className="icon-wrap">
          <MdOutlineLocalParking className="icon" />
        </div>
        <h4 className="title">Live Capacity Surveillance</h4>
        <p className="desc">
          Continuous monitoring of parking occupancy with automated limit
          enforcement.
        </p>
      </div>

      {/* CARD 2 */}
      <div className="feature-card reveal">
        <div className="icon-wrap">
          <HiOutlineBellAlert className="icon" />
        </div>
        <h4 className="title">Regulatory Alert Engine</h4>
        <p className="desc">
          Instant alerts when operators exceed approved parking thresholds.
        </p>
      </div>

      {/* CARD 3 */}
      <div className="feature-card reveal">
        <div className="icon-wrap">
          <AiOutlineFileProtect className="icon" />
        </div>
        <h4 className="title">Immutable Audit Records</h4>
        <p className="desc">
          Secure digital logs ensuring accountability and dispute resolution.
        </p>
      </div>

    </div>
  </div>

  {/* ===== STYLES ===== */}
  <style>{`
    .feature-card {
      background: #020617;
      border: 1px solid #1e293b;
      padding: 2.5rem;
      border-radius: 1rem;
      transition: all 0.4s ease;
      position: relative;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      border-color: #14b8a6;
      box-shadow: 0 20px 40px rgba(20, 184, 166, 0.15);
    }

    .icon-wrap {
      width: 60px;
      height: 60px;
      background: rgba(20, 184, 166, 0.1);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      transition: all 0.4s ease;
    }

    .feature-card:hover .icon-wrap {
      background: rgba(20, 184, 166, 0.2);
      transform: scale(1.1) rotate(3deg);
    }

    .icon {
      font-size: 32px;
      color: #2dd4bf;
    }

    .title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #e5e7eb;
      margin-bottom: 0.75rem;
    }

    .desc {
      color: #9ca3af;
      line-height: 1.6;
    }
  `}</style>

</section>


      {/* ================= ACCESS ================= */}
      <section className="bg-white-950">
        <div className="max-w-4xl mx-auto px-8 py-24 reveal">
          <h3 className="text-3xl font-bold text-center mb-8">
            Authorized Access
          </h3>

          <p className="text-center text-gray-400 mb-12">
            Secure entry point for municipal officials and regulatory authorities.
          </p>

          <div className="flex justify-center">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 w-full max-w-md hover:border-teal-500 transition">
              <Link
                to="/mcd/login"
                className="block text-center bg-teal-500 text-slate-900 py-3 rounded-md font-semibold hover:bg-teal-400 transition"
              >
                Secure Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="bg-slate-950">
        <div className="max-w-4xl mx-auto px-8 py-24 text-center reveal">
          <h3 className="text-3xl font-bold mb-4">
            Official Communication
          </h3>
          <p className="text-gray-400">
            For deployment, integration, or support inquiries
          </p>
          <p className="text-teal-400 font-semibold text-lg mt-2">
            support@civicparking.gov.in
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white-950 border-t border-slate-800 text-center py-6 text-gray-500">
        <p className="text-sm">
          © {new Date().getFullYear()} Civic Parking Oversight System | Government Platform
        </p>
      </footer>

      {/* ================= ANIMATIONS ================= */}
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease;
        }
        .reveal.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

    </div>
  );
}
