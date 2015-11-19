import apiClient from './client';

export default {

  texts: function texts() {
    return apiClient('/api/v1/texts.json');
  },

  text: function text(id) {
    return apiClient(`/api/v1/texts/${id}.json`);
  }

};

