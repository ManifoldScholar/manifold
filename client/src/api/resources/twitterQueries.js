export default {
  create(pId, twitterQuery) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/twitter_queries`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "twitter_queries", data: twitterQuery })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/twitter_queries/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/twitter_queries/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  update(id, twitterQuery) {
    return {
      endpoint: `/api/v1/twitter_queries/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "twitter_queries", data: twitterQuery })
      }
    };
  },

  fetch(id) {
    return {
      endpoint: `/api/v1/twitter_queries/${id}/relationships/fetch`,
      method: "POST",
      options: {}
    };
  }
};
