import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import App from "./App";
import AlertBox from "./alertBox/AlertBox";
import { LoginPage, AuthPage, RequireAuth } from "./Login";
import Chat from "./chat/Chat";
import Config from "./config/Config";
import { AuthContextProvider } from "./store/auth-context";
import { BadgeContextProvider } from "./store/badge-context";
import "./css/index.css";

ReactDOM.render(
  <AuthContextProvider>
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
                <BadgeContextProvider>
                  <Chat />
                </BadgeContextProvider>
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
  </AuthContextProvider>,
  document.getElementById("App")
);

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}
