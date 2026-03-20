export default {
  index(params) {
    return {
      endpoint: "/api/v1/search_results",
      method: "GET",
      options: { params }
    };
  }
};
