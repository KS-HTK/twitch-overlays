import axios from "axios";

const baseURL = process.env.REACT_APP_URL;
const client_id = process.env.REACT_APP_CLIENT_ID;

const TwitchAPI = axios.create({
  baseURL: baseURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Content-Type": "application/json",
    "Client-ID": client_id,
  },
});

export const loginUrl =
  process.env.REACT_APP_AUTH_URL +
  "?redirect_uri=" +
  process.env.REACT_APP_REDIRECT_URI +
  "&response_type=token&client_id=" +
  client_id +
  "&scope=user:read:email";
