const type = {
    1: "RPL_WELCOME",
    2: "RPL_YOURHOST",
    3: "RPL_CREATED",
    4: "RPL_MYINFO",
    375: "RPL_MOTDSTART",
    372: "RPL_MOTD",
    376: "RPL_ENDOFMOTD",

    353: "RPL_NAMREPLY",
    366: "RPL_ENDOFNAMES",
}

export default function parseIrc(str) {
    if (typeof str !== "string" || !str.endsWith("\r\n")) {
        console.log(typeof str);
        return null;
    }
    let messages = [];
    let prefix, command, params, tail;
    for (const s of str.split("\r\n")) {
        if (s === "") continue;
        if (s.startsWith(":")) {
            [prefix, tail] = s.split(/ (.+)/); //split string at first space
            prefix = prefix.substring(1);
            [command, params] = tail.split(/ (.+)/);
        }
        else {
            prefix = ""
            let tmp = s.split(/ (.+)/);
            command = tmp[0];
            params = tmp[1];
        }
        if (!isNaN(command)) {
            if (parseInt(command) in type) command = type[parseInt(command)];
            else console.warn(`Unknown nummeric irc command:`, command);
        }
        messages.push({prefix, command, params});
    }
    for (let msg of messages) {
        if (msg.command === "PRIVMSG") {
            let tmp = msg.params.split(/ (.+)/);
            msg.taret = tmp[0];
            msg.message = tmp[1].substring(1); 
        }
    }
    return messages;
}