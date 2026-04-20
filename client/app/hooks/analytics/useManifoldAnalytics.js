import { useEffect, useState } from "react";
import { get } from "lodash-es";
import CookieHelper from "helpers/cookie/Browser";
import ch from "helpers/consoleHelpers";
import { v1 as uuidv1 } from "uuid";
import { analyticEventsAPI } from "api";
import { useApiCallback, useAuthentication } from "hooks";

const cookie = new CookieHelper();

function nullTracker(trackedEventIgnored) {}

function manifoldAnalyticsEnabled(settings) {
  return !get(settings, "attributes.general.disableInternalAnalytics");
}

function generateVisitorToken() {
  const token = uuidv1();
  cookie.write("visitorToken", token, { expires: 365 });
  return token;
}

function generateVisitToken() {
  const token = uuidv1();
  cookie.write("visitToken", token, { expires: 1 });
  return token;
}

function getTokens() {
  const visitorToken = cookie.read("visitorToken") || generateVisitorToken();
  const visitToken = cookie.read("visitToken") || generateVisitToken();

  return { visitToken, visitorToken };
}

export default function useManifoldAnalytics(location, settings) {
  const { currentUser } = useAuthentication();
  const createAnalyticEvent = useApiCallback(analyticEventsAPI.create);
  const [consentManifoldAnalytics, setConsentManifoldAnalytics] = useState(
    currentUser?.attributes?.consentManifoldAnalytics || false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const anonConsent = JSON.parse(cookie.read("anonAnalyticsConsent") ?? "{}");
    const consent =
      currentUser?.attributes?.consentManifoldAnalytics ||
      anonConsent?.consentManifoldAnalytics;
    setConsentManifoldAnalytics(consent);
  }, [currentUser]);

  useEffect(() => {
    if (manifoldAnalyticsEnabled(settings) && consentManifoldAnalytics) {
      if (import.meta.env.DEV) {
        ch.notice(
          `Manifold analytics initialized.`,
          "chart_with_upwards_trend"
        );
      }
    }
  }, [settings, consentManifoldAnalytics]);

  const track = trackedEvent => {
    const { visitToken, visitorToken } = getTokens();
    const { resourceType, resourceId, event } = trackedEvent;

    if (import.meta.env.DEV) {
      ch.notice(
        `Tracking Manifold Analytics event: ${event}/${resourceType}/${resourceId}.`,
        "chart_with_upwards_trend"
      );
    }
    const payload = {
      attributes: {
        name: event,
        properties: {},
        recordType: resourceType,
        recordId: resourceId
      }
    };
    createAnalyticEvent(visitorToken, visitToken, payload).catch(() => {});
  };

  if (!manifoldAnalyticsEnabled(settings) || !consentManifoldAnalytics)
    return { track: nullTracker, leave: nullTracker };

  return { track };
}
