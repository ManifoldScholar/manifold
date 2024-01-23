import React, { useEffect } from "react";
import get from "lodash/get";
import CookieHelper from "helpers/cookie/Browser";
import config from "config";
import ch from "helpers/consoleHelpers";
import uuid from "uuid";
import { entityStoreActions, currentUserActions } from "actions";
import { analyticEventsAPI, requests } from "api";
import { useFromStore } from "hooks";

const { request } = entityStoreActions;
const cookie = new CookieHelper();

function nullTracker(trackedEventIgnored) {}

function manifoldAnalyticsEnabled(settings) {
  return !get(settings, "attributes.general.disableInternalAnalytics");
}

function generateVisitorToken() {
  const token = uuid.v1();
  cookie.write("visitorToken", token, { expires: 365 });
  return token;
}

function generateVisitToken() {
  const token = uuid.v1();
  cookie.write("visitToken", token, { expires: 1 });
  return token;
}

function getTokens() {
  const visitorToken = cookie.read("visitorToken") || generateVisitorToken();
  const visitToken = cookie.read("visitToken") || generateVisitToken();

  return { visitToken, visitorToken };
}

export default function useManifoldAnalytics(location, settings, dispatch) {
  const { currentUser } = useFromStore("authentication") ?? {};

  const anonConsent = JSON.parse(cookie.read("anonAnalyticsConsent") ?? "{}");

  const consentManifoldAnalytics =
    currentUser?.attributes?.consentManifoldAnalytics ||
    anonConsent?.consentManifoldAnalytics;

  useEffect(() => {
    if (manifoldAnalyticsEnabled(settings) && consentManifoldAnalytics) {
      const { visitToken, visitorToken } = getTokens();
      dispatch(currentUserActions.setVisitorToken(visitorToken));
      dispatch(currentUserActions.setVisitToken(visitToken));
      if (config.environment.isDevelopment) {
        ch.notice(
          `Manifold analytics initialized.`,
          "chart_with_upwards_trend"
        );
      }
    }
  }, [dispatch, settings, consentManifoldAnalytics]);

  const track = trackedEvent => {
    const { visitToken, visitorToken } = getTokens();
    const { resourceType, resourceId, event } = trackedEvent;

    if (config.environment.isDevelopment) {
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
    const call = analyticEventsAPI.create(visitorToken, visitToken, payload);
    const trackRequest = request(call, requests.analyticsEventCreate, {
      silent: true,
      suppressErrors: true
    });
    dispatch(trackRequest);
  };

  if (!manifoldAnalyticsEnabled(settings) || !consentManifoldAnalytics)
    return { track: nullTracker, leave: nullTracker };

  return { track };
}
