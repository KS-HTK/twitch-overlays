import { useEffect, useState } from "react";
import { ApiRequest } from "../services/Twitch";
import useAuth from "../store/auth-context";
import useBadges from "../store/badge-context";
import useEmotes from "../store/emote-context";
import Message from "./components/Message";
import "../css/Chat.css";

const tmi = require("tmi.js");

const userName = process.env.REACT_APP_USER_NAME;

export default function Chat() {
  const { token } = useAuth();
  const { setGlobalBadges, setChannelBadges, badgeResetKey } = useBadges();
  const { setGlobalEmotes, setChannelEmotes, emoteResetKey } = useEmotes();
  const [broadcaster, setBroadcaster] = useState(undefined);
  const [messages, setMessages] = useState([]);

  const client = new tmi.Client({
    options: { debug: true },
    identity: {
      username: userName,
      password: `oauth:${token}`,
    },
    channels: [userName],
  });

  const setInfo = (obj) => {
    setBroadcaster(obj[0]);
  };
  useEffect(() => {
    ApiRequest(token, "users", setInfo, { login: userName });
  }, [true]);
  useEffect(() => {
    if (!broadcaster) return;
    ApiRequest(token, "chat/badges/global", setGlobalBadges);
    ApiRequest(token, "chat/badges", setChannelBadges, {
      broadcaster_id: broadcaster.id,
    });
  }, [badgeResetKey, broadcaster]);
  useEffect(() => {
    if (!broadcaster) return;
    ApiRequest(token, "chat/emotes/global", setGlobalEmotes);
    ApiRequest(token, "chat/emotes", setChannelEmotes, {
      broadcaster_id: broadcaster.id,
    });
  }, [emoteResetKey, broadcaster]);
  useEffect(() => {
    client.connect();
    client.on("message", (channel, tags, message, self) => {
      let neoMsgs = messages.concat(
        <Message
          key={tags["id"]}
          channel={channel}
          tags={tags}
          msg={message}
          self={self}
        />,
      );
      if (neoMsgs.length > 50) neoMsgs = neoMsgs.slice(-50);
      setMessages(neoMsgs);
      console.log(messages);
    });
  }, []);
  return (
    <>
      <h1>Chat</h1>
      {messages}
    </>
  );
}
