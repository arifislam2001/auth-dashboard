import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginUserMutation();
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    const form = new FormData(e.target);
    try {
      const res = await login({
        email: form.get("email"),
        password: form.get("password"),
      }).unwrap();

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setMessage(err?.data?.message || "Can't connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 bg-white rounded-xl shadow-sm border border-neutral-200"
      >
        <h1 className="text-2xl font-semibold text-neutral-900">Welcome back</h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">Sign in to your account</p>

        <label className="block text-sm text-neutral-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          className="w-full px-3 py-2 mb-4 border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-neutral-300"
        />

        <label className="block text-sm text-neutral-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          required
          className="w-full px-3 py-2 mb-2 border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-neutral-300"
        />

        <div className="text-right mb-5">
          <Link to="/forgot-password" className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {message && <p className="mt-4 text-sm text-center text-red-600">{message}</p>}

        <p className="mt-6 text-sm text-center text-neutral-500">
          Don't have an account?{" "}
          <Link to="/registration" className="font-medium text-neutral-900 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}