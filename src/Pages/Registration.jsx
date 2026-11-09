import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../services/api";

const inputCls =
  "w-full px-3 py-2 mb-4 border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-neutral-300";

export default function Registration() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const form = new FormData(e.target);
    const body = {
      username: form.get("username"),
      email: form.get("email"),
      password: form.get("password"),
      gender: form.get("gender"),
      phone: form.get("phone") || undefined,
      address: form.get("address") || undefined,
      dob: form.get("dob") || undefined,
    };

    try {
      const res = await registerUser(body).unwrap();
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 bg-white rounded-xl shadow-sm border border-neutral-200"
      >
        <h1 className="text-2xl font-semibold text-neutral-900">Create account</h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">Fill in your details to sign up</p>

        <label className="block text-sm text-neutral-700 mb-1">Username</label>
        <input name="username" maxLength={16} required placeholder="arif" className={inputCls} />

        <label className="block text-sm text-neutral-700 mb-1">Email</label>
        <input type="email" name="email" required placeholder="you@example.com" className={inputCls} />

        <label className="block text-sm text-neutral-700 mb-1">Password</label>
        <input type="password" name="password" required placeholder="••••••••" className={inputCls} />

        <label className="block text-sm text-neutral-700 mb-1">Gender</label>
        <select name="gender" required defaultValue="" className={inputCls}>
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label className="block text-sm text-neutral-700 mb-1">Phone (optional)</label>
        <input name="phone" placeholder="01XXXXXXXXX" className={inputCls} />

        <label className="block text-sm text-neutral-700 mb-1">Address (optional)</label>
        <input name="address" placeholder="Dhaka" className={inputCls} />

        <label className="block text-sm text-neutral-700 mb-1">Date of birth (optional)</label>
        <input type="date" name="dob" className={inputCls} />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-60"
        >
          {isLoading ? "Creating..." : "Sign up"}
        </button>

        {message && (
          <p className="mt-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">{message}</p>
        )}
        {error && (
          <p className="mt-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</p>
        )}

        <p className="mt-6 text-sm text-center text-neutral-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-neutral-900 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}