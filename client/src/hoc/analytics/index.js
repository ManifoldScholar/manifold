import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import withSettings from "hoc/withSettings";
import { withRouter } from "react-router-dom";
import { ManifoldAnalyticsContext } from "helpers/contexts";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useManifoldAnalytics from "./hooks/useManifoldAnalytics";

function Analytics({ location, settings, children, dispatch }) {
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

  // Trigger a global leave event before unloading the client application.
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
  location: PropTypes.object.isRequired,
  settings: PropTypes.object,
  authToken: PropTypes.string,
  children: PropTypes.element.isRequired
};

export default withRouter(withSettings(Analytics));
