// probably want to add this to cms at some point

export const scavHuntData = {
    pointsPer: 5,
    items: [
      { 
        id: 0,
        title: "Binary Bridge",
        hint: "There is a bridge near the building you're at right now.  Decode the message on it to solve this clue.",
        answer: "KLAUS",
        isQR: false,
        releaseDate: Date.parse("2021-09-22T20:30:00.000000-04:00")
      },
      { 
        id: 1,
        title: "3D Printed Buzz",
        hint: "Find our school mascot, close to where lunch will be served to find the answer for this clue.",
        answer: "buzzy bee",
        isQR: true,
        releaseDate: Date.parse("2021-10-22T21:30:00.000000-04:00")
      },
      { 
        id: 2,
        title: "Building (Clothing)",
        hint: "Go try on some clothes in Klaus to find the answer for this clue.",
        answer: "white and old gold",
        isQR: true,
        releaseDate: Date.parse("2021-10-23T11:30:00.000000-04:00")
      },
      { 
        id: 3,
        title: "Night Market",
        hint: "Explore the market tonight and look for a code to the answer for this clue.",
        answer: "shopping with burdell",
        isQR: true,
        releaseDate: Date.parse("2021-10-23T11:30:00.000000-04:00")
      },
      { 
        id: 4,
        title: "Stairs",
        hint: "Go to the colorful stairs and enter the order of all the colors you see (separated by commas).",
        answer: "Purple, Blue, Green, Yellow, Orange, Pink, Blue, White, Black, Brown",
        isQR: false,
        releaseDate: Date.parse("2021-10-23T11:30:00.000000-04:00")
      }
    ]
  }