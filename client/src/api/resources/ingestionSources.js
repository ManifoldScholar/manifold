export default {
  index(textId, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/ingestion_sources`,
      method: "GET",
      options: { params: { filter, page } }
    };
  },

  show(textId, id) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/ingestion_sources/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(textId, asset) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/ingestion_sources`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "ingestion_sources", data: asset })
      }
    };
  },

  update(textId, id, asset) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/ingestion_sources/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "ingestion_sources", data: asset })
      }
    };
  },

  destroy(textId, id) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/ingestion_sources/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
