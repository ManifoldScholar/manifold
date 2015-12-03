export default {

  whoami() {
    return {
      endpoint: '/api/v1/users/whoami',
      method: 'GET',
      options: {}
    };
  }

};

