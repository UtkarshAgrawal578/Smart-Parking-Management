import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function MCDLogin() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.token) localStorage.setItem("token", data.token);
    alert("Login Successfull");
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          MCD Login
        </h1>

        <div className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600 outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Login
          </button>
                  <p className="text-center text-sm text-gray-600 mt-4">
  Don’t have an account?{" "}
  <Link
    to="/mcd/signup"
    className="text-blue-600 font-semibold hover:underline"
  >
    Signup
  </Link>
</p>
        </div>
      </div>
    </div>
  );
}
