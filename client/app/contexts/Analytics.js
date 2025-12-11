import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router";
import { useSettings } from "hooks";
import { ManifoldAnalyticsContext } from "contexts";
import useGoogleAnalytics from "hooks/analytics/useGoogleAnalytics";
import useManifoldAnalytics from "hooks/analytics/useManifoldAnalytics";

export default function Analytics({ children }) {
  const location = useLocation();
  const settings = useSettings();

  const { track: googleTrack } = useGoogleAnalytics(location, settings);

  const { track: manifoldTrack } = useManifoldAnalytics(location, settings);

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
