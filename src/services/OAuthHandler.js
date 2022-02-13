import React from "react";
import useAuth from "../store/auth-context";
import OAuthProvider from "./oauth/OAuthProvider";

const providerConfig = {
  clientId: process.env.REACT_APP_CLIENT_ID,
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
  authorizationUrl: process.env.REACT_APP_AUTH_URL,
  scope: "chat:read",
  width: 720,
  height: 600,
};

export default function AuthProvider() {
  let auth = useAuth();
  function onOAuthProviderLogin(data) {
    console.log("Auth success", data);
    if(data.token_type !== "bearer") {
      console.error("Token type does not match.");
      return null
    }
    auth.setToken(data.access_token);
    /*window.localStorage.setItem(
      "OAuthProvider_token",
      JSON.stringify(data.code) || JSON.stringify(data)
    );*/
  }

  function onOAuthProviderLoginFailure(err) {
    console.error(err);
  }

  return (
    <OAuthProvider
      config={providerConfig}
      successCallback={onOAuthProviderLogin}
      errorCallback={onOAuthProviderLoginFailure}
      textDisplay="Login to Twitch"
    />
  );
}
