export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/journal_issues`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(jId, journalIssue) {
    return {
      endpoint: `/api/v1/journals/${jId}/relationships/journal_issues`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "journal_issues", data: journalIssue })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/journal_issues/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/journal_issues/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  update(id, journalIssue) {
    return {
      endpoint: `/api/v1/journal_issues/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "journal_issues", data: journalIssue })
      }
    };
  }
};
