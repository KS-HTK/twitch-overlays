import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./index.css";
import App from "./App";
import AlertBox from "./alertBox/AlertBox";
import { LoginPage, AuthPage, RequireAuth } from "./Auth";
import { AuthContextProvider } from "./store/auth-context";
import Chat from "./chat/Chat";
import Config from "./config/Config";
import { BadgeContextProvider } from "./store/badge-context";
import { EmoteContextProvider } from "./store/emote-context";

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
                  <EmoteContextProvider>
                    <Chat />
                  </EmoteContextProvider>
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
