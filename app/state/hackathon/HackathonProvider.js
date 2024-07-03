import React, { useEffect, useState } from "react";
import { hackathonReducer } from "./HackathonReducer";
import {
  TOGGLE_STAR,
  TOGGLE_STAR_SCHEDULE,
  SET_EVENTS,
} from "./HackathonActionTypes";
import HackathonContext from "./HackathonContext";
import { fetchHackathonData } from "../../cms";
import {
  getEvents,
  getHexathon,
  getBlocks,
  getScavengerHunt,
} from "../../api/api";

const STATE_REFRESH_TIME = 5 * 60 * 1000

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

    const interval = setInterval(() => {
      if (firebaseUser) {
        // don't set isLoading to true or else it'll be bad visually
        getHackathon(firebaseUser);
      }
    }, STATE_REFRESH_TIME);

    return () => clearInterval(interval);
  }, []);

  const getHackathon = async (fUser) => {
    // const hackathons = data.data.allHackathons;

    const token = await fUser.getIdToken();
    const raw = await getHexathon(token);
    const hexathon = raw.json;

    if (hexathon) {
      const { eventJson } = await getEvents(token);
      const { blockJson } = await getBlocks(token);
      const { scavengerHuntJson } = await getScavengerHunt(token);

      hexathon.events = eventJson ? eventJson : [];
      hexathon.blocks = blockJson ? blockJson : [];
      hexathon.scavengerHunt = scavengerHuntJson ? scavengerHuntJson : [];

      value.state.hackathon = hexathon;
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
