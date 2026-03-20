export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/journals",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  update(id, journal) {
    return {
      endpoint: `/api/v1/journals/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "journal", data: journal })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/journals/${id}`,
      method: "GET",
      options: {}
    };
  },

  create(journal) {
    return {
      endpoint: "/api/v1/journals",
      method: "POST",
      options: {
        body: JSON.stringify({ type: "journal", data: journal })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/journals/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  actionCallouts(id) {
    return {
      endpoint: `/api/v1/journals/${id}/relationships/action_callouts`,
      method: "GET"
    };
  },

  journalIssues(jId, page = {}, filter = {}) {
    return {
      endpoint: `/api/v1/journals/${jId}/relationships/journal_issues`,
      method: "GET",
      options: {
        params: { page, filter }
      }
    };
  }
};
