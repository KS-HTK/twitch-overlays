import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { loginUrl } from "./services/Twitch";
import "./Auth.css";

let AuthContext = React.createContext();

export function AuthProvider({ children }) {
  let [authToken, setAuthToken] = useState(null);
  let [authValid, setAuthValid] = useState(false);

  let refresh = (newAuthToken) => {
    setAuthToken(newAuthToken);
    setAuthValid(true);
  };

  let value = { authToken, authValid, refresh };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.authToken) {
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

  if (!auth.authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function AuthPage() {
  let location = useLocation();

  const hash = location.hash
    .substring(1)
    .split("&")
    .map((v) => v.split("="))
    .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {});
  window.opener.setToken(hash);
  window.close();
  return <p>Authentication was successfull, you may close this window.</p>;
}

function popup() {
  return window.open(loginUrl, "newwindow", "width=200,height=800");
}

export function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";
  console.log(from, location, "/login");

  if (auth.authValid) {
    navigate(from, { replace: true });
  }

  window.setToken = (hash) => {
    if (hash.token_type !== "bearer") return null;
    auth.refresh(hash.access_token, () => {
      navigate(from, { replace: true });
    });
  };

  return (
    <>
      <a href="//:0" onClick={popup}>
        Login using Twitch
      </a>
    </>
  );
}
