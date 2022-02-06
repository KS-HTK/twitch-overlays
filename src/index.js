import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./index.css";
import App from "./App";
import AlertBox from "./alertBox/AlertBox";
import {
  LoginPage,
  AuthPage,
  AuthProvider,
  AuthStatus,
  RequireAuth,
} from "./Auth";
import Chat from "./chat/Chat";
import Config from "./config/Config";

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/alertBox"
            element={
              <RequireAuth>
                <AlertBox />
              </RequireAuth>
            }
          />
          <Route
            path="/chat"
            element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            }
          />
          <Route
            path="/config"
            element={
              <RequireAuth>
                <Config />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById("App")
);

function Layout() {
  return (
    <>
      <AuthStatus />
      <Outlet />
    </>
  );
}
