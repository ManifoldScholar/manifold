export default {

  whoami() {
    return {
      endpoint: '/api/v1/users/whoami',
      method: 'GET',
      options: {}
    };
  },

  create(user) {
    return {
      endpoint: '/api/v1/users',
      method: 'POST',
      options: {
        body: JSON.stringify({ user })
      }
    };
  }

};
