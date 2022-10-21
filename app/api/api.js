export const CURRENT_HEXATHON = {
  id: "62d9ed68d0a69b88c06bdfb2",
  name: "HackGT 9",
};

export const API_SERVICE_URLS = {
  registration: "https://registration.api.hexlabs.org",
  users: "https://users.api.hexlabs.org",
  hexathons: "https://hexathons.api.hexlabs.org",
  auth: "https://auth.api.hexlabs.org",
  files: "https://files.api.hexlabs.org",
  notifications: "https://notifications.api.hexlabs.org",
};

export const EVENT_TYPE_COLOR_MAP = {
  ceremony: "#b52c22",
  food: "#19458c",
  important: "#2CDACF",
  "mini-challenge": "#C866F5",
  "mini-event": "#FF8D28",
  speaker: "#FF586C",
  "submission-expo": "#77DD77",
  "tech-talk": "#FFB6C1",
  workshop: "#786CEB",
};

export const logInteraction = async (token, type, userId, identifier) => {

  let body = {
    userId: userId,
    type: type,
    hexathon: CURRENT_HEXATHON.id,
  };
  if (identifier) {
    body.identifier = identifier;
  }
  try {
    const response = await fetch(`${API_SERVICE_URLS.hexathons}/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      json: { message: "Network error when logging interaction" },
    };
  }
};

export const getUserProfile = async (token, uid) => {
  try {
    const response = await fetch(`${API_SERVICE_URLS.users}/users/${uid}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    return {
      status: 500,
      json: { message: "Network error when getting user profile" },
    };
  }
};

export const getRegistrationApplication = async (token, hexathonId, userId) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.registration}/applications?hexathon=${hexathonId}&userId=${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    return {
      status: 500,
      json: { message: "Network error when getting application" },
    };
  }
};

export const getEvents = async (token) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.hexathons}/events?hexathon=${CURRENT_HEXATHON.id}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const eventJson = await response.json();
    eventJson.sort((a, b) => {
      return Date.parse(a.startDate) - Date.parse(b.startDate);
    });
    return { status: response.status, eventJson };
  } catch (err) {
    return {
      status: 500,
      json: { message: "Network error when getting application" },
    };
  }
};
