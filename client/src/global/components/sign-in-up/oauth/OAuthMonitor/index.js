import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { oauthActions } from "actions";
import { isOauthEvent } from "utils/oauth";
import { useDispatch } from "react-redux";
import { useFromStore } from "hooks";

const MONITOR_FREQUENCY = 100;

export default function Monitor() {
  const dispatch = useDispatch();
  const oauth = useFromStore("oauth");

  useEffect(() => {
    const onMessage = e => {
      if (isOauthEvent(e)) {
        dispatch(oauthActions.oauthResponse(e));
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [dispatch]);

  useEffect(() => {
    const monitorPopup = () => {
      if (oauth.started && oauth.popup?.closed) {
        dispatch(oauthActions.cancel());
      }
    };
    const monitorInterval = setInterval(monitorPopup, MONITOR_FREQUENCY);

    return () => clearInterval(monitorInterval);
  }, [dispatch, oauth]);

  return oauth?.errors?.length ? (
    <ul>
      {oauth.errors.map(error => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  ) : null;
}

Monitor.displayName = "Global.SignInUp.OAuthMonitor";
