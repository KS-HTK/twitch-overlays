import React from 'react';
import useBadges from "../../store/badge-context";

function Badge({ imgUrl }) {
  return <img className="badge" alt="" src={imgUrl} />;
}

//generate badge img tags for message
export default function Badges({ badges }) {
  const { globalBadges, channelBadges } = useBadges();

  let badgeComponents = [];

  for (let badge in badges) {
    //continue to next badge if the badge value is false
    if (!badge) continue;
    let badgeInfo;
    if (globalBadges.hasOwnProperty(badge)) {
      badgeInfo = globalBadges[badge];
    } else if (channelBadges.hasOwnProperty(badge)) {
      badgeInfo = channelBadges[badge];
    } else {
      console.error("Badge not found:", badge, badges[badge], globalBadges, channelBadges);
      continue;
    }
    //always get v1 at 4x (don't know if that is how it should be done)
    let imgUrl = badgeInfo[badges[badge]].image_url_4x;
    badgeComponents.push(<Badge key={badge} imgUrl={imgUrl} />);
  }
  return <>{badgeComponents}</>;
}
