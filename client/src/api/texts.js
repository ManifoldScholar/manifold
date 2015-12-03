import apiClient from './client';

export default {

  texts(filter, page) {
    return {
      endpoint: '/api/v1/texts',
      method: 'GET',
      options: {
        params: {filter, page}
      }
    };
  },

  text(id) {
    return {
      endpoint: `/api/v1/texts/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

};

