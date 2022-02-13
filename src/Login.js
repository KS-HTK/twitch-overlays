import React from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import useAuth from "./store/auth-context";
import AuthProvider from "./services/OAuthHandler";
import "./css/Auth.css";

export function AuthStatus() {
  let auth = useAuth();

  if (!auth.token) {
    return (
      <p>
        Login: <span className="dot fail"></span>
      </p>
    );
  }

  return (
    <p>
      Login: <span className="dot success"></span>
    </p>
  );
}

export function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function AuthPage() {
  return (
    <p>
      If you see this page long enough to read this text, either something went
      wrong or you opend it directly. This Popup should close automatically. If
      this is not the case, please have a look at the DevConsole of the parent
      window. It might provide further clues to what went wrong.
    </p>
  );
}

export function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  if (auth.validateToken) {
    navigate(from, { replace: true });
  }

  return (
    <>
      <AuthProvider />
    </>
  );
}
