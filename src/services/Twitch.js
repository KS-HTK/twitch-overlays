const apiUrl = process.env.REACT_APP_API_URL;
const authUrl = process.env.REACT_APP_AUTH_URL;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;

const scope = "chat:read";

export const loginUrl =
  authUrl +
  "?redirect_uri=" +
  redirectUri +
  "&response_type=token&client_id=" +
  clientId +
  "&scope=" +
  scope;

export function apiRequest(
  token,
  endpoint,
  callback = (res) => {},
  params = null
) {
  let paramStr = "";
  if (params !== null) {
    for (const [key, val] of Object.entries(params)) {
      paramStr = paramStr.concat("&", key, "=", val);
    }
    paramStr = paramStr.replace("&", "?");
  }
  let headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  headers.append("Client-ID", clientId);

  const req = new Request(apiUrl + "/" + endpoint + paramStr, { headers });

  fetch(req).then(
    (res) => {
      if (res.ok) {
        res.json().then((data) => {
          callback(data.data);
        });
      } else {
        console.warn(
          "API request to " +
            endpoint +
            " generated unsuccessful response." +
            res.body
        );
      }
    },
    (reason) => {
      console.warn("API request to " + endpoint + " failed:\n" + reason);
    }
  );
}
