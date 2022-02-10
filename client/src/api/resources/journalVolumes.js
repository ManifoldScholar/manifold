export default {
  index(jId, page = {}) {
    return {
      endpoint: `/api/v1/journals/${jId}/relationships/journal_volumes`,
      method: "GET",
      options: {
        params: { page }
      }
    };
  },

  create(jId, journalvolume) {
    return {
      endpoint: `/api/v1/journals/${jId}/relationships/journal_volumes`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "journal_volumes", data: journalvolume })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/journal_volumes/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/journal_volumes/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  update(id, journalvolume) {
    return {
      endpoint: `/api/v1/journal_volumes/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "journal_volumes", data: journalvolume })
      }
    };
  }
};
