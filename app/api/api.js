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

export const logInteraction = async (token, type, userId, identifier) => {
  const body = {
    userId: userId,
    identifier: identifier,
    type: type,
    hexathon: CURRENT_HEXATHON.id,
  };
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
