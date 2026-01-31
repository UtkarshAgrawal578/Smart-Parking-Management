import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function MCDSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
    navigate("/mcd/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          MCD Officer Signup
        </h1>

        <div className="space-y-4">
          {["name", "email", "employee_id", "department", "password"].map(
            (field) => (
              <input
                key={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                placeholder={field.toUpperCase()}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>
              <p className="text-center text-sm text-gray-600 mt-4">
  Already have an account?{" "}
  <Link
    to="/mcd/login"
    className="text-blue-600 font-semibold hover:underline"
  >
    Login
  </Link>
</p>

        </div>
      </div>
    </div>
  );
}
