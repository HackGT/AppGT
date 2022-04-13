const _logInteraction = async (hackathonName, type, userId, identifier) => {
  const dev = false;

  const prodUrl = "https://interactions.api.hexlabs.org/interactions";
  const devUrl = "https://log.dev.hack.gt/log/interaction";
  const keys = require("../keys/keys.json");
  const prodToken = keys.scavHunt;
  const devToken = "rangerover";

  // const body = {
  //     'uuid': uid,
  //     'eventID': 'ScavengerHunt' + hintId,
  //     'interactionType': 'inperson',
  //     'eventType': 'scavengerhunt'
  //   }
  const body = {
    userId: userId,
    identifier: identifier,
    type: type,
    hackathon: hackathonName,
  };
  console.log(
    "Notifying that interaction occured for ",
    body,
    "\nwith auth: ",
    "Bearer " + (dev ? devToken : prodToken)
  );
  try {
    const response = await fetch(dev ? devUrl : prodUrl, {
      method: "POST",
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: "Bearer " + (dev ? devToken : prodToken),
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    console.log("Hint complete notification response: ", json);

    return { json, status: response.status };
  } catch (err) {
    console.error("Hint complete notification error: ", err);

    return false;
  }
};

const _getPoints = () => {};

export const logInteraction = _logInteraction.bind(this);
// export const notifyHintComplete = _notifyHintComplete.bind(this)
