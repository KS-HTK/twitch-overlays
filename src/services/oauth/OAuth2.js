import React, { useState } from "react";
import Popup from "./Popup";

export default function OAuth2(props) {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleClick = () => {
    setPopupOpen(true);
  };

  const childrenWithProps = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, { onClick: handleClick });
  });

  const params = new URLSearchParams();
  Object.entries({
    client_id: props.clientId,
    redirect_uri: props.redirectUri,
    scope: props.scope,
    response_type: "token",
    display: "popup",
  }).forEach(([key, val]) => params.append(key, val));
  console.log(params.toString());

  const url = props.authorizationUrl + "?" + params.toString();

  return (
    <div>
      <Popup open={popupOpen} popupUrl={url} {...props} />
      {childrenWithProps}
    </div>
  );
}
