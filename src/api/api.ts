export const DEFAULT_HEXATHON = {
  id: '683f9a9ab75ad31cd0f2ec67',
  name: 'HackGT 13',
};

export const CURRENT_HEXATHON = { ...DEFAULT_HEXATHON };

export const API_SERVICE_URLS = {
  registration: 'https://registration.api.hexlabs.org',
  users: 'https://users.api.hexlabs.org',
  hexathons: 'https://hexathons.api.hexlabs.org',
  auth: 'https://auth.api.hexlabs.org',
  files: 'https://files.api.hexlabs.org',
  notifications: 'https://notifications.api.hexlabs.org',
};

export const EVENT_TYPE_COLOR_MAP: Record<string, string> = {
  ceremony: '#b52c22',
  food: '#468bfa',
  important: '#2CDACF',
  'mini-challenge': '#C866F5',
  'mini-event': '#FF8D28',
  speaker: '#FF586C',
  'submission-expo': '#77DD77',
  'tech-talk': '#FFB6C1',
  workshop: '#786CEB',
};

export const logInteraction = async (
  token: string,
  type: string,
  userId: string,
  identifier?: string
) => {
  const body: Record<string, string> = {
    userId,
    type,
    hexathon: CURRENT_HEXATHON.id,
  };
  if (identifier) {
    body.identifier = identifier;
  }
  try {
    const response = await fetch(`${API_SERVICE_URLS.hexathons}/interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    console.log(err);
    return { status: 500, json: { message: 'Network error when logging interaction' } };
  }
};

export const checkoutSwagItem = async (token: string, userId: string, swagItemId: string) => {
  const body = { swagItemId, quantity: 1 };
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.hexathons}/${CURRENT_HEXATHON.id}/users/${userId}/actions/purchase-swag-item`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
      }
    );
    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    console.log(err);
    return { status: 500, json: { message: 'Network error when checking out swag' } };
  }
};

export const getHexathon = async (token: string) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.hexathons}/hexathons/${CURRENT_HEXATHON.id}`,
      { method: 'GET', headers: { Authorization: 'Bearer ' + token } }
    );
    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    return { status: 500, json: { message: 'Network error when getting hexathons' } };
  }
};

export const getUserProfile = async (token: string, uid: string) => {
  try {
    const response = await fetch(`${API_SERVICE_URLS.users}/users/${uid}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    });
    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    return { status: 500, json: { message: 'Network error when getting user profile' } };
  }
};

export const getHexathonUser = async (token: string, hexathonId: string, uid: string) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.hexathons}/hexathon-users/${hexathonId}/users/${uid}`,
      { method: 'GET', headers: { Authorization: 'Bearer ' + token } }
    );
    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    return {
      status: 500,
      json: { message: 'Network error when getting hexathon user information' },
    };
  }
};

export const getRegistrationApplication = async (
  token: string,
  hexathonId: string,
  userId: string
) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.registration}/applications?hexathon=${hexathonId}&userId=${userId}`,
      { method: 'GET', headers: { Authorization: 'Bearer ' + token } }
    );
    const json = await response.json();
    return { status: response.status, json };
  } catch (err) {
    return { status: 500, json: { message: 'Network error when getting application' } };
  }
};

export const getEvents = async (token: string) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.hexathons}/events?hexathon=${CURRENT_HEXATHON.id}`,
      { method: 'GET', headers: { Authorization: 'Bearer ' + token } }
    );
    const eventJson = await response.json();
    eventJson.sort((a: any, b: any) => Date.parse(a.startDate) - Date.parse(b.startDate));
    return { status: response.status, eventJson };
  } catch (err) {
    return { status: 500, json: { message: 'Network error when getting events' } };
  }
};

export const getBlocks = async (token: string) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.hexathons}/blocks?hexathon=${CURRENT_HEXATHON.id}`,
      { method: 'GET', headers: { Authorization: 'Bearer ' + token } }
    );
    let blockJson = await response.json();
    blockJson = blockJson.filter((block: any) => block.display === 'MOBILE');
    return { status: response.status, blockJson };
  } catch (err) {
    return { status: 500, json: { message: 'Network error when getting blocks' } };
  }
};

export const getScavengerHunt = async (token: string) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.hexathons}/blocks?hexathon=${CURRENT_HEXATHON.id}`,
      { method: 'GET', headers: { Authorization: 'Bearer ' + token } }
    );
    let blockJson = await response.json();
    blockJson = blockJson.filter((block: any) => block.display === 'MOBILE');
    const scavBlock = blockJson.find((block: any) => block.slug === 'scavenger-hunt');
    // eslint-disable-next-line no-eval
    const scavengerHuntJson = scavBlock ? eval(scavBlock.content) : [];
    return { status: response.status, scavengerHuntJson };
  } catch (err) {
    return { status: 500, json: { message: 'Network error when getting scavenger hunt' } };
  }
};

export const getSwagItems = async (token: string) => {
  try {
    const response = await fetch(
      `${API_SERVICE_URLS.hexathons}/swag-items?hexathon=${CURRENT_HEXATHON.id}`,
      { method: 'GET', headers: { Authorization: 'Bearer ' + token } }
    );
    const swagJson = await response.json();
    swagJson.sort((a: any, b: any) => b.points - a.points);
    return { status: response.status, swagJson };
  } catch (err) {
    return { status: 500, json: { message: 'Network error when getting swag items' } };
  }
};
