import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useResetPasswordMutation } from "../Services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      const res = await resetPassword({ token, password }).unwrap();
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.data?.message || "Something went wrong, please try again");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 bg-white rounded-xl shadow-sm border border-neutral-200"
      >
        <h1 className="text-2xl font-semibold text-neutral-900">
          Set new password
        </h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">
          Choose a strong password you haven't used before.
        </p>

        <label className="block text-sm text-neutral-700 mb-1">
          New password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-neutral-300"
        />

        <label className="block text-sm text-neutral-700 mb-1">
          Confirm password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full px-3 py-2 mb-5 border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-neutral-300"
        />

        <button
          type="submit"
          disabled={isLoading || !!message}
          className="w-full py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Reset password"}
        </button>

        {message && (
          <p className="mt-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
            {message} Redirecting to sign in...
          </p>
        )}
        {error && (
          <p className="mt-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-neutral-500">
          <Link to="/login" className="font-medium text-neutral-900 hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}