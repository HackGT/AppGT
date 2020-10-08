const hackathonQuery = `
  allHackathons(where: { isActive: true }) {
      id
      name
      slackUrl
      isActive
      events(orderBy: "startDate") {
          id
          name
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
  }
  
  allTypes {
      id
      name
  }
  
  allFAQs {
      id
      question
      answer
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

export const fetchHackathonData = getHackathonData.bind(this, hackathonQuery);
