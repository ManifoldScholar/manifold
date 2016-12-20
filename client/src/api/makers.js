export default {

  index(filter = {}) {
    return {
      endpoint: '/api/v1/makers',
      method: 'GET',
      options: {
        params: { filter }
      }
    };
  },

  create(maker) {
    return {
      endpoint: '/api/v1/makers',
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "makers", data: maker })
      }
    };
  },

};
