const _notifyHintComplete = async (uid, hintId) => {

  const dev = false

  const prodUrl = "https://log.2021.hack.gt/log/interaction"
  const devUrl = "https://log.dev.hack.gt/log/interaction"
  const keys = require('../keys/keys.json')
  const prodToken = keys.scavHunt
  const devToken = 'rangerover'

  const body = {
      'uuid': uid,
      'eventID': 'ScavengerHunt' + hintId,
      'interactionType': 'inperson',
      'eventType': 'scavengerhunt'
    }
  console.log('Notifying that hint is complete for ', body, '\nwith auth: ', 'Bearer ' + (dev ? devToken : prodToken))
  return fetch(dev ? devUrl : prodUrl, {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      "Accept": `application/json`,
      "Authorization": 'Bearer ' + (dev ? devToken : prodToken)
    },
    body: JSON.stringify(body),
  }).then((r) => {
    console.log('Hint complete notification response: ', r)
    return r.status === 200
  }).catch((err) => {
    console.error('Hint complete notification error: ', err);
    return false
  })
}


const _getPoints = () => {

}

export const notifyHintComplete = _notifyHintComplete.bind(this)
