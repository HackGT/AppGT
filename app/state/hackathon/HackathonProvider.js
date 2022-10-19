import React, { useEffect, useState } from "react";
import { hackathonReducer } from "./HackathonReducer";
import { TOGGLE_STAR, TOGGLE_STAR_SCHEDULE, SET_EVENTS } from "./HackathonActionTypes";
import HackathonContext from "./HackathonContext";
import { fetchHackathonData } from "../../cms";
import { getEvents } from "../../api/api";

export default function HackathonProvider({ initialValue, firebaseUser, children }) {
  const [state, dispatch] = React.useReducer(hackathonReducer, initialValue);
  const [isLoading, setIsLoading] = useState(true)

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
        value: events
      })
  };

  useEffect(() => {
    getHackathon(firebaseUser)
  }, [])


  const getHackathon = async (fUser) => {
    console.log('getting hackathon for ', fUser)
    const data = await fetchHackathonData()
    // no response back, just return
    if (data == null || data.data == null) {
      return;
    }

    const hackathons = data.data.allHackathons;
    console.log('remote hackathons: ', hackathons)
    const eventTypes = data.data.allTypes;
    if (hackathons != null && hackathons.length != 0) {
      console.log("Hackathon found remotely.");
      var hackathon = hackathons[0];
      const token = await fUser.getIdToken()
      const {eventJson} = await getEvents(token)
      hackathon.events = eventJson
      value.state.eventTypes = eventTypes
      value.state.hackathon = hackathon
      setIsLoading(false)
    } else {
      // if still loading, present error asking for retry
    }
  }

  console.log("value", value, initialValue);

  return (
    <HackathonContext.Provider value={{...value, isLoading}}>
      {children}
    </HackathonContext.Provider>
  );
}
