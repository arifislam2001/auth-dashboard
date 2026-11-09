import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../Services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await forgotPassword({ email }).unwrap();
      setMessage(res.message);
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
          Forgot password?
        </h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <label className="block text-sm text-neutral-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mb-5 border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-neutral-300"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </button>

        {message && (
          <p className="mt-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-neutral-500">
          Remembered your password?{" "}
          <Link to="/login" className="font-medium text-neutral-900 hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}