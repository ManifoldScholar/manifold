export default {
  show(id) {
    return {
      endpoint: `/api/v1/action_callouts/${id}`,
      method: "GET",
      options: {}
    };
  },

  createForProject(pId, actionCallout) {
    return {
      endpoint: `/api/v1/projects/${pId}/relationships/action_callouts`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "action_callout", data: actionCallout })
      }
    };
  },

  createForJournal(jId, actionCallout) {
    return {
      endpoint: `/api/v1/journals/${jId}/relationships/action_callouts`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "action_callout", data: actionCallout })
      }
    };
  },

  update(id, actionCallout) {
    return {
      endpoint: `/api/v1/action_callouts/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "action_callout", data: actionCallout })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/action_callouts/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
