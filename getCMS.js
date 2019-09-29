var fetch = require("node-fetch");

var queryMessage = `query {
    talks(start: 0) {
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
    faqs(start: 0) {
        title
        description
    }
    meals(start: 0) {
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
            diet_restriction
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
      query: queryMessage
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
    console.log(result);
    return result;
  });
});
