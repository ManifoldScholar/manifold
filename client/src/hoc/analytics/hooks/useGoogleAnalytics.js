import React, { useEffect } from "react";
import get from "lodash/get";
import ReactGA4 from "react-ga4";
import ReactUA from "react-ga";
import ch from "helpers/consoleHelpers";
import config from "config";

function nullTracker(trackedEventIgnored) {}

export default function useGoogleAnalytics(location, settings) {
  const uaId = get(settings, "attributes.integrations.gaTrackingId");
  const ga4Id = get(settings, "attributes.integrations.gaFourTrackingId");

  useEffect(() => {
    if (ga4Id) {
      ReactGA4.initialize(ga4Id, { debug: false });
      if (config.environment.isDevelopment) {
        ch.notice(
          `Google Analytics initialized for ${ga4Id}.`,
          "chart_with_upwards_trend"
        );
      }
    } else if (uaId) {
      ReactUA.initialize(uaId, { debug: false });
      if (config.environment.isDevelopment) {
        ch.notice(
          `Google Analytics initialized for ${uaId}.`,
          "chart_with_upwards_trend"
        );
      }
    }
  }, [ga4Id, uaId, settings]);

  useEffect(() => {
    if (ga4Id) {
      const path = location.pathname + location.search;
      ReactGA4.send({ hitType: "pageview", path });
      if (config.environment.isDevelopment) {
        ch.notice(`Tracking GA pageview: ${path}.`, "chart_with_upwards_trend");
      }
    } else if (uaId) {
      const path = location.pathname + location.search;
      ReactUA.pageview(path);
      if (config.environment.isDevelopment) {
        ch.notice(`Tracking GA pageview: ${path}.`, "chart_with_upwards_trend");
      }
    }
  }, [location, ga4Id, uaId, settings]);

  // For now, we're not tracking Manifold events in Analytics. However, we could
  // easily send them as custom events.
  return { track: nullTracker };
}
