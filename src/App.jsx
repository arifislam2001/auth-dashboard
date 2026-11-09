import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";

const PrivateRoute = ({ children }) =>
  localStorage.getItem("accessToken") ? children : <Navigate to="/login" replace />;

const PublicRoute = ({ children }) =>
  localStorage.getItem("accessToken") ? <Navigate to="/dashboard" replace /> : children;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/registration" element={<PublicRoute><Registration /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}