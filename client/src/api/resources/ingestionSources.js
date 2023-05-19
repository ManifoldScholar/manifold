export default {
  index(textId, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/ingestion_sources`,
      method: "GET",
      options: { params: { filter, page } }
    };
  }
};
