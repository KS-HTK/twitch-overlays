import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const authUrl = process.env.REACT_APP_AUTH_URL;
const redirectUrl = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;

export const twitchApi = axios.create({
  baseURL: apiUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Content-Type": "application/json",
    "Client-ID": clientId,
  },
});

export const loginUrl =
  authUrl + "?redirect_uri=" +
  redirectUrl + "&response_type=token&client_id=" +
  clientId + "&scope=user:read:email";
