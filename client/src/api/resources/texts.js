export default {

  index(filter, page) {
    return {
      endpoint: '/api/v1/texts',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/texts/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  create(text) {
    return {
      endpoint: '/api/v1/texts',
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "texts", data: text })
      }
    };
  },

  update(id, text) {
    return {
      endpoint: `/api/v1/texts/${id}`,
      method: 'PUT',
      options: {
        body: JSON.stringify({ type: "texts", data: text })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/texts/${id}`,
      method: 'DELETE',
      options: {}
    };
  }

};
