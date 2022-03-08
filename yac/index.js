const _logInteraction = async (hackthonName, type, userId, identifier) => {

  const dev = false

  const prodUrl = "https://interactions.api.hexlabs.org/"
  const devUrl = "https://log.dev.hack.gt/log/interaction"
  const keys = require('../keys/keys.json')
  const prodToken = keys.scavHunt
  const devToken = 'rangerover'

  // const body = {
  //     'uuid': uid,
  //     'eventID': 'ScavengerHunt' + hintId,
  //     'interactionType': 'inperson',
  //     'eventType': 'scavengerhunt'
  //   }
  const body = {
    'userId': userId,
    'identifier': identifier,
    'type': type,
    'hackathon': hackathonName
  }
  console.log('Notifying that interaction occured for ', body, '\nwith auth: ', 'Bearer ' + (dev ? devToken : prodToken))
  return fetch(dev ? devUrl : prodUrl, {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      "Accept": `application/json`,
      "Authorization": 'Bearer ' + (dev ? devToken : prodToken)
    },
    body: JSON.stringify(body),
  }).then((r) => {
    console.log('Interaction response: ', r)
    return r.status === 200
  }).catch((err) => {
    console.error('Interaction error: ', err);
    return false
  })
}


const _getPoints = () => {

}

export const logInteraction = _logInteraction.bind(this)
// export const notifyHintComplete = _notifyHintComplete.bind(this)
