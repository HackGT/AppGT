var fetch = require("node-fetch");

var workshopMessage = `query {
    workshops(start: 0) {
      id
      start_time
      createdAt
      updatedAt
      image {
        url
        hash
      }
    }
    meals(start: 0) {
      restaurant {
        name
      }
      start_time
      end_time
      description
	  title
      tags {
        name
      }
      menu_items {
        name
        diet_restriction
      }
    }
    events(start: 0) {
      start_time
      end_time
      title
      description
      tags {
        name
      }
    }
}`;
async function getCMSData() {
  return fetch("https://cms.hack.gt/graphql", {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      Accept: `application/json`
    },
    body: JSON.stringify({
      query: workshopMessage
    })
  })
    .then(r => {
      return r.json();
    })
    .catch(err => {
      return false;
    });
}
export default (getAllData = () => {
  return getCMSData().then(result => {
    return result;
  });
});
