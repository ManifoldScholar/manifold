export default {
  create(projectId, ingestion) {
    return {
      endpoint: `/api/v1/projects/${projectId}/relationships/ingestions`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "ingestions", data: ingestion })
      }
    };
  },

  update(id, ingestion) {
    return {
      endpoint: `/api/v1/ingestions/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "ingestions", data: ingestion })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/ingestions/${id}`,
      method: "GET",
      options: {}
    };
  },

  createSection(textId, ingestion) {
    return {
      endpoint: `/api/v1/texts/${textId}/relationships/ingestions`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "ingestions", data: ingestion })
      }
    };
  }
};
