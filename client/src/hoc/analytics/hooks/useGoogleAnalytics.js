import React, { useEffect } from "react";
import get from "lodash/get";
import ReactGA from "react-ga4";
import ch from "helpers/consoleHelpers";
import config from "config";
import { useFromStore } from "hooks";

function nullTracker(trackedEventIgnored) {}

function getGoogleAnalyticsId(settings) {
  return get(settings, "attributes.integrations.gaTrackingId");
}

function googleAnalyticsEnabled(settings) {
  return !!getGoogleAnalyticsId(settings);
}

export default function useGoogleAnalytics(location, settings) {
  const googleAnalyticsId = getGoogleAnalyticsId(settings);
  const { currentUser } = useFromStore("authentication") ?? {};

  useEffect(() => {
    if (googleAnalyticsEnabled(settings)) {
      ReactGA.initialize(googleAnalyticsId, { debug: false });
      if (config.environment.isDevelopment) {
        ch.notice(
          `Google Analytics initialized for ${googleAnalyticsId}.`,
          "chart_with_upwards_trend"
        );
      }

      if (!currentUser?.attributes.consentGoogleAnalytics) {
        ReactGA.gtag("consent", "default", {
          analytics_storage: "denied"
        });
      }
    }
  }, [googleAnalyticsId, settings, currentUser]);

  useEffect(() => {
    if (googleAnalyticsEnabled(settings)) {
      const path = location.pathname + location.search;
      ReactGA.send({ hitType: "pageview", path });
      if (config.environment.isDevelopment) {
        ch.notice(`Tracking GA pageview: ${path}.`, "chart_with_upwards_trend");
      }
    }
  }, [location, settings]);

  // For now, we're not tracking Manifold events in Analytics. However, we could
  // easily send them as custom events.
  return { track: nullTracker };
}
