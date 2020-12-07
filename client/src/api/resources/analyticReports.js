export default {
  index(params) {
    return {
      endpoint: "/api/v1/analytics/reports",
      method: "GET",
      options: { params }
    };
  }
};
