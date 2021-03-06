import React, { useEffect, useState, useRef } from "react";
import { apiRequest } from "../services/Twitch";
import useAuth from "../store/auth-context";
import useBadges from "../store/badge-context";
import Message from "./components/Message";
import "../css/Chat.css";

const tmijs = require("tmi.js");

const userName = process.env.REACT_APP_USER_NAME;

export default function Chat() {
  const { token } = useAuth();
  const { setGlobalBadges, setChannelBadges, badgeResetKey } = useBadges();
  const [broadcaster, setBroadcaster] = useState(undefined);
  const tmi = useRef();
  const messages = useRef([]);
  const [msgs, setMsgs] = useState(messages.current);

  useEffect(() => {
    tmi.current = new tmijs.Client({
      options: { debug: false, skipUpdatingEmotesets: true },
      identity: {
        username: userName,
        password: `oauth:${token}`,
      },
      channels: [userName],
    });
    tmi.current.connect();

    const tmiCurrent = tmi.current;
    return () => {
      tmiCurrent.disconnect();
    };
  }, [token]);

  const setInfo = (obj) => {
    setBroadcaster(obj[0]);
  };
  useEffect(() => {
    apiRequest(token, "users", setInfo, { login: userName });
  }, [token]);
  useEffect(() => {
    if (!broadcaster) return;
    apiRequest(token, "chat/badges/global", setGlobalBadges);
    apiRequest(token, "chat/badges", setChannelBadges, {
      broadcaster_id: broadcaster.id,
    });
  }, [badgeResetKey, broadcaster, token]);
  useEffect(() => {
    tmi.current.on("message", (channel, tags, message, self) => {
      const id = tags["id"];
      if (!(id in Object.fromEntries(messages.current))) {
        messages.current.push([
          tags["id"],
          <Message
            key={tags["id"]}
            channel={channel}
            tags={tags}
            msg={message}
            self={self}
          />,
        ]);
        if (messages.current.length > 50) messages.current.shift();
        console.log(messages.current);
      }
      setMsgs(
        messages.current.map((kvarr) => {
          return kvarr[1];
        })
      );
    });
  }, []);
  return (
    <div className="container">
      <div className="viewport">{msgs}</div>
      <div className="shadowRealm"></div>
    </div>
  );
}
