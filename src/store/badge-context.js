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
    badgeResetKey: state.badgeResetKey,
    globalBadges: state.globalBadges,
    channelBadges: state.channelBadges,
    setGlobalBadges: state.setGlobalBadges,
    setChannelBadges: state.setChannelBadges,
  };
}

function init(badgeResetKey) {
  return {
    badgeResetKey,
    globalBadges: undefined,
    channelBadges: undefined,
    setGlobalBadges: (newObj) => {},
    setChannelBadges: (newObj) => {},
  };
}

const BadgeContext = createContext(init(true));

export function BadgeContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, true, init);

  function globalUpdateHandler(obj) {
    dispatch({ type: "global", payload: { globalBadges: obj } });
  }

  function channelUpdateHandler(obj) {
    dispatch({ type: "channel", payload: { channelBadges: obj } });
  }

  const context = {
    badgeResetKey: state.badgeResetKey,
    globalBadges: state.globalBadges,
    channelBadges: state.channelBadges,
    setGlobalBadges: globalUpdateHandler,
    setChannelBadges: channelUpdateHandler,
  };
  return (
    <BadgeContext.Provider value={context}>
      {props.children}
    </BadgeContext.Provider>
  );
}

export default function useBadges() {
  return useContext(BadgeContext);
}
