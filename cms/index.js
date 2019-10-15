const eventQuery = `
  talks(start: 0) {
  id
    base {
        start_time
        end_time
        title
        description
    tags {
      name
    }
        area {
            name
            mapgt_slug
            capacity
        }
    }
    people {
        name
        bio
        link
        image {
            url
        }
    }
  }
  meals(start: 0) {
    id
      base {
          start_time
          end_time
          title
          description
          tags {
            name
          }
          area {
            name
            mapgt_slug
            capacity
          }
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
  return fetch("https://cms.hack.gt/graphql", {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      Accept: `application/json`
    },
    body: JSON.stringify({
      query: `query {
        ${queryString}
      }`
    })
  })
    .then(r => {
      return r.json();
    })
    .catch(err => {
      console.error(err);
      return false;
    });
}

export const fetchInfoBlocks = getCMSData.bind(this, infoQuery);
export const fetchEvents = getCMSData.bind(this, eventQuery);
export const fetchAll = getCMSData.bind(this, allQueries);