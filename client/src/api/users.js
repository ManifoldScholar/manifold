export default {

  whoami() {
    return {
      endpoint: '/api/v1/users/whoami',
      method: 'GET',
      options: {}
    };
  },

  index(filter = {}, page = {}) {
    return {
      endpoint: '/api/v1/users',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  create(user) {
    return {
      endpoint: '/api/v1/users',
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "user", data: { attributes: user } })
      }
    };
  }

};
