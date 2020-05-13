const eventQuery = `
  eventbases(start: 0) {
    id
    title
    description
    start_time
    end_time
    tags {
      name
    }
    area {
      name
    }
  }
  talks(start: 0) {
    base {
      id
    }
    people {
      name
    }
  }
  meals(start: 0) {
    base {
      id
    }
    restaurant_name
    restaurant_link
    menu_items {
      name
      dietrestrictions {
        name
      }
    }
  }
  tags(start: 0) {
    name
  }
`;

const infoQuery = `
  infoblocks(start: 0) {
    title
    body
    slug
  }
`;

const allQueries = [eventQuery, infoQuery].join("\n");

const getCMSData = async (queryString) => {
  return fetch("https://cms.dev.hack.gt/graphql", {
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

export const fetchInfoBlocks = getCMSData.bind(this, infoQuery);
export const fetchEvents = getCMSData.bind(this, eventQuery);
export const fetchAll = getCMSData.bind(this, allQueries);
