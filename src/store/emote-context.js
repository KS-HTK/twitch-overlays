import { createContext, useContext, useReducer } from "react";

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
    emoteResetKey: state.emoteResetKey,
    globalEmotes: state.globalEmotes,
    channelEmotes: state.channelEmotes,
    setGlobalEmotes: state.setGlobalEmotes,
    setChannelEmotes: state.setChannelEmotes,
  };
}

function init(emoteResetKey) {
  return {
    emoteResetKey,
    globalEmotes: undefined,
    channelEmotes: undefined,
    setGlobalEmotes: (newObj) => {},
    setChannelEmotes: (newObj) => {},
  };
}

const EmoteContext = createContext(init(true));

export function EmoteContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, true, init);

  function globalUpdateHandler(obj) {
    dispatch({ type: "global", payload: { globalEmotes: obj } });
  }

  function channelUpdateHandler(obj) {
    dispatch({ type: "channel", payload: { channelEmotes: obj } });
  }

  const context = {
    emoteResetKey: state.emoteResetKey,
    globalEmotes: state.globalEmotes,
    channelEmotes: state.channelEmotes,
    setGlobalEmotes: globalUpdateHandler,
    setChannelEmotes: channelUpdateHandler,
  };
  return (
    <EmoteContext.Provider value={context}>
      {props.children}
    </EmoteContext.Provider>
  );
}

export default function useEmotes() {
  return useContext(EmoteContext);
}
