import React from "react";
import OAuth2 from "./OAuth2";

export default function OAuthProvider(props) {
  const { config, textDisplay, className, successCallback, errorCallback } =
    props;
  config.successCallback = successCallback;
  config.errorCallback = errorCallback;
  return (
    <OAuth2 {...config}>
      <button className={className}>{textDisplay}</button>
    </OAuth2>
  );
};
