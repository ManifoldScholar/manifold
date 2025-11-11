import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFromStore } from "hooks";
import { requests } from "api";
import { ManifoldAnalyticsContext } from "helpers/contexts";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useManifoldAnalytics from "./hooks/useManifoldAnalytics";

export default function Analytics({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });

  const { track: googleTrack } = useGoogleAnalytics(location, settings);

  const { track: manifoldTrack } = useManifoldAnalytics(
    location,
    settings,
    dispatch
  );

  const onTrack = useCallback(
    trackedEvent => {
      googleTrack(trackedEvent);
      manifoldTrack(trackedEvent);
    },
    [googleTrack, manifoldTrack]
  );

  useEffect(() => {
    const handler = () => {
      onTrack({ event: "leave" });
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [onTrack]);

  return (
    <ManifoldAnalyticsContext.Provider value={{ track: onTrack }}>
      {children}
    </ManifoldAnalyticsContext.Provider>
  );
}

Analytics.propTypes = {
  children: PropTypes.element.isRequired
};
