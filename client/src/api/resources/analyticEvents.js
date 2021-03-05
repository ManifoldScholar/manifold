export default {
  create(visitorToken, visitToken, event) {
    return {
      endpoint: `/api/v1/analytics/events`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "analyticsEvent", data: event }),
        visitToken,
        visitorToken
      }
    };
  }
};
