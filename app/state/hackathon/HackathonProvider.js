import React, { useEffect, useState } from "react";
import { hackathonReducer } from "./HackathonReducer";
import {
  TOGGLE_STAR,
  TOGGLE_STAR_SCHEDULE,
  SET_EVENTS,
} from "./HackathonActionTypes";
import HackathonContext from "./HackathonContext";
import { fetchHackathonData } from "../../cms";
import { getEvents } from "../../api/api";

export default function HackathonProvider({
  initialValue,
  firebaseUser,
  children,
}) {
  const [state, dispatch] = React.useReducer(hackathonReducer, initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // could set state to state from useReducer, but for some reason it sets eventTypes to an emtpy array, so I'm just directly setting state to initialValues
  var value = {
    state: state,
    toggleStar: (event) =>
      dispatch({
        type: TOGGLE_STAR,
        value: event,
      }),
    toggleIsStarSchedule: () =>
      dispatch({
        type: TOGGLE_STAR_SCHEDULE,
        value: null,
      }),
    setEvents: (events) =>
      dispatch({
        type: SET_EVENTS,
        value: events,
      }),
  };

  useEffect(() => {
    getHackathon(firebaseUser);
  }, []);

  const getHackathon = async (fUser) => {
    const data = await fetchHackathonData();
    // no response back, just return
    if (data == null || data.data == null) {
      return;
    }

    const hackathons = data.data.allHackathons;
    if (hackathons != null && hackathons.length != 0) {
      let hackathon = hackathons[0];
      const token = await fUser.getIdToken();
      const { eventJson } = await getEvents(token);
      // const testEvent = { description: 'test desc', startDate: "2022-10-21T00:00:00.000Z", endDate: "2022-11-20T02:00:00.000Z", hexathon: "62d9ed68d0a69b88c06bdfb2", id: "63516bdad676a93b24d46010", name: "test name", type: "ceremony", location: [{ name: 'Ferst Center', id: "63516bdad676a93b24d46011" }], tags: [] };
      // hackathon.events = eventJson
      // hackathon.events.push(testEvent)
      hackathon.events = eventJson
      value.state.hackathon = hackathon;
      setIsLoading(false);
    } else {
      // if still loading, present error asking for retry
    }
  };

  return (
    <HackathonContext.Provider value={{ ...value, isLoading }}>
      {children}
    </HackathonContext.Provider>
  );
}
