import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const authUrl = process.env.REACT_APP_AUTH_URL;
const redirectUrl = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;

export const loginUrl =
  authUrl + "?redirect_uri=" +
  redirectUrl + "&response_type=token&client_id=" +
  clientId + "&scope=user:read:email";


export function ApiRequest(token, endpoint, callback = (res)=>{}, params = null) {
  const twitchApi = axios.create({
    baseURL: apiUrl,
    headers: {
      "Authorization": "Bearer "+token,
      "Client-ID": clientId,
    },
  });
  
  let paramStr = "";
  if (params !== null) {
    for (const [key, val] of Object.entries(params)) {
      paramStr = paramStr.concat("&", key, "=", val);
    }
    paramStr = paramStr.replace("&", "?");
  }
  twitchApi.get(endpoint+paramStr).then((res) => {callback(res.data.data)},(reason) => {console.warn("API request to "+endpoint+"failed:\n"+reason)})
  return null;
}