const hackathonQuery = `
  allHackathons(where: { isUsedForMobileApp: true }) {
      isUsedForMobileApp
      id
      name
      slackUrl
      isActive
      events(orderBy: "startDate") {
          id
          name
          url
          startDay
          startTime
          startDate
          endDay
          endTime
          endDate
          description
          tags {
            id
            name
          }
          type {
              id
              name
              color
          }
          location {
              id
              name
              capacity
          }
      }
      blocks {
        id
        name
        slug
        content
        usage
      }
      faqs {
        id
        question
        answer
        index
      }
  }
  
  allTypes {
      id
      name
      color
  }
`;

const getHackathonData = async (queryString) => {
  // return fetch("https://keystone.dev.hack.gt/admin/api", {
  return fetch("https://cms.hack.gt/admin/api", {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      Accept: `application/json`,
    },
    body: JSON.stringify({
      query: `query {
        ${queryString}
      }`,
    }),
  })
    .then((r) => {
      return r.json();
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
};

const getServerTime = async () => {
  return fetch("http://worldtimeapi.org/api/timezone/America/New_York", {
    method: "GET"
  }).then((r) => {
    return r.json()
  }).catch((err) => {
    console.error(err);
    return false
  })
}

export const fetchHackathonData = getHackathonData.bind(this, hackathonQuery);
export const fetchServerTime = getServerTime.bind(this)