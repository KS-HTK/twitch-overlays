import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthContextProvider(props) {
  const [token, setToken] = useState(undefined);

  function validateToken() {
    const valid = (token!==undefined); //TODO: check if token is currently valid
    return valid;
  }

  const context = {
    token,
    validateToken,
    setToken
  };
  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
