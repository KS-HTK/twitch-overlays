import { useEffect, useState } from "react";
import { ApiRequest } from "../services/Twitch";
import useAuth from "../store/auth-context";
import useBadges from "../store/badge-context";
import useEmotes from "../store/emote-context";

const userName = process.env.REACT_APP_USER_NAME;

export default function Chat(props) {
  const { token } = useAuth();
  const { globalBadges, channelBadges, setGlobalBadges, setChannelBadges, badgeResetKey } = useBadges();
  const { globalEmotes, channelEmotes, setGlobalEmotes, setChannelEmotes, emoteResetKey } = useEmotes();
  const [broadcaster, setBroadcaster] = useState(undefined);
  const setInfo = (obj) => {
    setBroadcaster(obj[0]);
  }
  useEffect(()=>{
    ApiRequest(token, "users", setInfo, {"login":userName});
  },[true]);
  useEffect(()=>{
    if(!broadcaster) return;
    ApiRequest(token, "chat/badges/global", setGlobalBadges);
    ApiRequest(token, "chat/badges", setChannelBadges, {"broadcaster_id": broadcaster.id});
  }, [badgeResetKey, broadcaster]);
  useEffect(()=>{
    if(!broadcaster) return;
    ApiRequest(token, "chat/emotes/global", setGlobalEmotes);
    ApiRequest(token, "chat/emotes", setChannelEmotes, {"broadcaster_id": broadcaster.id});
  }, [emoteResetKey, broadcaster]);
  return (
    <>
      <h1>Chat</h1>
    </>
  );
}
