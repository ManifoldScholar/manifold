import apiClient from './client';
import { textSchema, textsSchema } from './schema';

export default {

  texts: function texts() {
    return apiClient('/api/v1/texts.json', textsSchema);
  },

  text: function text(id) {
    return apiClient(`/api/v1/texts/${id}.json`, textSchema);
  }

};

