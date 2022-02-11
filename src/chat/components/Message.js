import Badges from "./Badge";

export default function Message(props) {
  //props include channel, tags, message, self
  //self will always be false as Chat dosn't use Auth.

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
  let printMsg;
  /*if (emotes.length !== 0) {
    let newMsg = [];
    let ind = 0;
    emotes.forEach(function (emote) {
      if (ind + 1 !== emote.start) {
        newMsg.push(props.message.slice(ind, emote.start));
      }
      newMsg.push(
        `<img class="emote" alt="${emote.id}" src="${emote.id}"/>`
      );
      ind = emote.end + 1;
    });
    newMsg.push(props.message.slice(ind, props.message.length));
    printMsg = newMsg.join("");
  } else {*/
    printMsg = props.msg;
  //}

  return (
    <p class="line">
      <i className="timestamp">{time}</i>
      <Badges badges={props.tags["badges"]} />
      <b style={{color}}>{displayName}</b>: {printMsg}
    </p>
  );
}
