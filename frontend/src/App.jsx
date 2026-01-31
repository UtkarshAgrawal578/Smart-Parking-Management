import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import MCDLogin from "./pages/MCD/MCDLogin";
import MCDSignup from "./pages/MCD/MCDSignup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard & Logs */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />

        {/* MCD Login & Signup */}
        <Route path="/mcd/login" element={<MCDLogin />} />
        <Route path="/mcd/signup" element={<MCDSignup />} />
      </Routes>
    </BrowserRouter>
  );
}
