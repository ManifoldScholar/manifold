import React from "react";
import PropTypes from "prop-types";
import withSettings from "hoc/with-settings";
import { withRouter } from "react-router-dom";
import { ManifoldAnalyticsContext } from "helpers/contexts";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useManifoldAnalytics from "./hooks/useManifoldAnalytics";

function Analytics({ location, settings, children, dispatch }) {
  const googleTrack = useGoogleAnalytics(location, settings);
  const manifoldTrack = useManifoldAnalytics(location, settings, dispatch);

  const trackEvent = (name, properties) => {
    googleTrack(name, properties);
    manifoldTrack(name, properties);
  };

  return (
    <ManifoldAnalyticsContext.Provider value={{ track: trackEvent }}>
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
