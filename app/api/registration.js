const REGISTRATION_URL = 'registration.api.hexlabs.org'

export async function getApplication(token, hexathonId, userId) {
    const response = await fetch(`${REGISTRATION_URL}/applications?hexathon=${hexathonId}&userId=${userId}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    const json = await response.json();
    return { json, status: response.status };
}