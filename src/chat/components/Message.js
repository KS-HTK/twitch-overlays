import React from 'react';
import Badges from "./Badge";

export default function Message(props) {
  //props include channel, tags, msg, self
  console.log("Recived Message: ", props.msg);

  //get time of message as 'hh:mm' format
  const time = new Date(parseInt(props.tags["tmi-sent-ts"])).toLocaleTimeString(
    navigator.language,
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  const displayName = props.tags["display-name"] || null;
  const userName = props.tags["username"];
  const color = props.tags["color"];
  //get emotes:
  const emotes = props.tags["emotes"];
  console.log(emotes);
  let printMsg;
  if (emotes !== null && emotes.length !== 0) {
    let newMsg = [];
    let ind = 0;
    // FIXME: Only the first emote of a Type gets translated to image… That should be fixed.
    let emo = [];
    Object.entries(emotes).forEach(([id, positions]) => {
      positions.forEach((pos) => {
        const [start, end] = pos.split("-");
        emo.push([id, parseInt(start), parseInt(end)]);
      });
    });
    emo.sort((a, b) => {
      return a[1] > b[1];
    });
    emo.forEach(([id, start, end]) => {
      const url = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/light/3.0`;
      if (ind + 1 !== start) {
        newMsg.push(props.msg.slice(ind, start));
      }
      newMsg.push(<img className="emote" alt={id} src={url} />);
      ind = end + 1;
    });
    newMsg.push(props.msg.slice(ind, props.msg.length));
    printMsg = newMsg;
  } else {
    printMsg = props.msg;
  }

  return (
    <p className="line">
      <i className="timestamp">{time}</i>
      <Badges badges={props.tags["badges"]} />
      <b style={{ color }}>
        {displayName === null || displayName === "" ? userName : displayName}
      </b>
      : {printMsg}
    </p>
  );
}
