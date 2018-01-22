export default {
  index(params) {
    return {
      endpoint: "/api/v1/reader_search_results",
      method: "GET",
      options: { params }
    };
  }
};
