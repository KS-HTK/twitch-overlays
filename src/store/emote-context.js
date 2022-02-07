import { createContext, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "global":
    case "channel":
      return Object.assign(rebuild(state), action.payload);
    default:
      throw new Error();
  }
}

function rebuild(state) {
  return {
    resetKey: state.resetKey,
    global: state.global,
    channel: state.channel,
  };
}

function init(resetKey) {
  return {
    resetKey,
    global: undefined,
    channel: undefined,
    setGlobal: (newObj) => {},
    setChannel: (newObj) => {},
  };
}

const EmoteContext = createContext(init(true));

export function EmoteContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, true, init);

  function globalUpdateHandler(obj) {
    dispatch({ type: "global", payload: { global: obj } });
  }

  function channelUpdateHandler(obj) {
    dispatch({ type: "channel", payload: { channel: obj } });
  }

  const context = {
    resetKey: state.resetKey,
    global: state.global,
    channel: state.channel,
    setGlobal: globalUpdateHandler,
    setChannel: channelUpdateHandler,
  };
  return (
    <EmoteContext.Provider value={context}>
      {props.children}
    </EmoteContext.Provider>
  );
}

export default EmoteContext;
