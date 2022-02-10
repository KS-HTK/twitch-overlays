import { useEffect, useState, useRef } from "react";
import parseIrc from "../services/irc-parser";
import { ApiRequest } from "../services/Twitch";
import useAuth from "../store/auth-context";
import useBadges from "../store/badge-context";
import useEmotes from "../store/emote-context";

const userName = process.env.REACT_APP_USER_NAME;
const chatUrl = process.env.REACT_APP_CHAT_URL;
const logWS = true;

let websocket = null;
let timeout = 500;

function StartWebsocket() {
  const { token } = useAuth();
  const [retry, setRetry] = useState(true);
  const ws = useRef();

  useEffect(() => {
    let connectInterval;
    ws.current = new WebSocket(chatUrl);
    // websocket onopen event listener
    ws.current.onopen = () => {
      console.log(`WebSocket to ${chatUrl} opened.`);
      websocket = ws.current;
      //send auth
      send(`PASS oauth:${token}\r\n`);
      send(`NICK ${userName}\r\n`);
      //reset reconnection timeout;
      timeout = 500;
      clearTimeout(connectInterval);
    };
    //websocket onclose event listener
    ws.current.onclose = (e) => {
      console.log(
        `Websocket connection closed. Reconnet will be attemted in ${Math.min(
          10000 / 1000,
          (timeout + timeout) / 1000
        )} seconds.`,
        e.reason
      );

      timeout = timeout + timeout; //double retry interval
      if (retry) connectInterval = setTimeout(check, Math.min(10000, timeout));
    };
    //websocket onerror event listener
    ws.current.onerror = (error) => {
      console.error(
        `WebSocket to ${chatUrl} encountered error: `,
        error.message,
        `Closing WebSocket`
      );
      WebSocket.close();
    };

    const wsCurrent = ws.current;
    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    //websocket onmessage event listener
    ws.current.onmessage = (evt) => {
      if (logWS) console.log(`[ws] <\n${evt.data}`);
      const msgs = parseIrc(evt.data);
      if (!msgs) {
        console.warn("Could not parse irc event.", evt.data);
        return;
      }
      for (let msg of msgs) {
        messageHandler(msg);
      }
    };
  });

  return null;
}

/**
 * used by the @function StartWebsocket to make sure the websocket connection is open.
 */
function check() {
  if (!websocket || websocket.readyState === WebSocket.CLOSED) StartWebsocket(); //check if websocket is alive.
}

function send(msg) {
  if (logWS) console.log(`[ws] > ${msg}`);
  websocket.send(msg);
}

function messageHandler(msg) {
  const {prefix, command, params } = msg;
  //get time of message as 'hh:mm' format
  //const time = new Date(message.timestamp).toLocaleTimeString(navigator.language, {
  //  hour: '2-digit',
  //  minute:'2-digit'
  //});
  if (command === "PRIVMSG") {
    console.debug(msg.message);
    /*const badgeHtml = getBadgeHtml(message.tags.badges, globalBadges, channelBadges);
      const displayName = message.tags.displayName;
      const color = message.tags.color;
      //get emotes:
      const emotes = message.tags.emotes;
      let printMsg;
      if (emotes.length !== 0) {
          let newMsg = []
          let ind = 0
          emotes.forEach( function (emote) {
              if (ind+1 !== emote.start) {
                  newMsg.push(msg.slice(ind, emote.start));
              }
              newMsg.push( `<img class="emote" alt="${emote.id}" src="https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/2.0"/>`);
              ind = emote.end + 1
          });
          newMsg.push(msg.slice(ind, msg.length));
          printMsg = newMsg.join("");
      }
      else {
          printMsg = msg
      }
      `<p class="line"><i>${time}</i>${badgeHtml}<b style="color:${color}">${displayName}</b>: ${printMsg}</p>`;
      */
  } else if (command === "JOIN") {
    console.log(`Successful connection to ${params}`);
  } else if (command === "PING") {
    send(`PONG :${params}`);
  } else if (command === "RPL_ENDOFMOTD") {
    //Join the channel after getting welcome and motd
    send(`JOIN #${userName}`);
  } else if (
    [
      "RPL_WELCOME",
      "RPL_YOURHOST",
      "RPL_CREATED",
      "RPL_MYINFO",
      "RPL_MOTDSTART",
      "RPL_MOTD",

      "RPL_NAMREPLY",
      "RPL_ENDOFNAMES",
    ].includes(command)
  ) {
    //Ignore these messages...
  } else {
    console.log("Unhandled message received.", "pr", prefix, "cmd", command, "par", params);
  }
}

export default function Chat(props) {
  const { token } = useAuth();
  const {
    globalBadges,
    channelBadges,
    setGlobalBadges,
    setChannelBadges,
    badgeResetKey,
  } = useBadges();
  const {
    globalEmotes,
    channelEmotes,
    setGlobalEmotes,
    setChannelEmotes,
    emoteResetKey,
  } = useEmotes();
  const [broadcaster, setBroadcaster] = useState(undefined);
  const [messages, setMessages] = useState([]);

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
  return (
    <>
      <StartWebsocket />
      <h1>Chat</h1>
    </>
  );
}
