export default {

  show() {
    return {
      endpoint: '/api/v1/me',
      method: 'GET',
      options: {
      }
    };
  },

  update(me) {
    return {
      endpoint: '/api/v1/me',
      method: 'PUT',
      options: {
        body: JSON.stringify({ me })
      }
    };
  }

};
