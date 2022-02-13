import React, { useEffect } from "react";
import Promise from "bluebird";

export default function Popup(props) {
  useEffect(() => {
    if (props.open) {
      openPopup();
    }
  }, [props.open]);

  const openPopup = () => {
    const width = props.width || 500;
    const height = props.height || 500;

    const options = {
      width: width,
      height: height,
      top: window.screenY + (window.outerHeight - height) / 2.5,
      left: window.screenX + (window.outerWidth - width) / 2,
    };
    const popup = window.open(
      props.popupUrl,
      "_blank",
      Object.entries(options)
        .map((arr) => {
          return arr.join("=");
        })
        .join(",")
    );
    console.log("Popup should have opend.");

    if (props.popupUrl === "about:blank") {
      popup.document.body.innerHTML = "Loading...";
    }

    pollPopup(popup)
      .then(props.successCallback, props.errorCallback)
      .catch(props.errorCallback);
  };

  function pollPopup(window) {
    return new Promise((resolve, reject) => {
      const redirectUri = new URL(props.redirectUri);
      const redirectUriPath = redirectUri.host + redirectUri.pathname;

      const polling = setInterval(() => {
        if (!window || window.closed || window.closed === undefined) {
          clearInterval(polling);
          reject(new Error("The popup window was closed"));
        }
        try {
          const popupUrlPath = window.location.host + window.location.pathname;

          if (popupUrlPath === redirectUriPath) {
            if (window.location.search || window.location.hash) {
              const queryString = window.location.search
                .substring(1)
                .replace(/\/$/, "");
              const hashString = window.location.hash
                .substring(1)
                .replace(/\/$/, "");
              const query = Object.fromEntries(
                new URLSearchParams(queryString)
              );
              const hash = Object.fromEntries(new URLSearchParams(hashString));
              const params = Object.assign({}, query, hash);
              if (params.error) {
                reject(new Error(params.error));
              } else {
                resolve(params);
              }
            } else {
              reject(
                new Error(
                  "OAuth redirect has occurred but no query or hash parameters were found."
                )
              );
            }
            // cleanup
            clearInterval(polling);
            window.close();
          }
        } catch (error) {
          console.error(error);
          // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
          // A hack to get around same-origin security policy errors in Internet Explorer.
        }
      }, 500);
    });
  }

  return null;
}
