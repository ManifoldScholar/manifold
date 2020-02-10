export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/projects",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(project) {
    return {
      endpoint: "/api/v1/projects",
      method: "POST",
      options: {
        body: JSON.stringify({ type: "project", data: project })
      }
    };
  },

  update(id, project) {
    return {
      endpoint: `/api/v1/projects/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "project", data: project })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/projects/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/projects/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  events(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/events`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  project_exportations(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/project_exportations`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  resources(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/resources`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  resourceCollections(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/resource_collections`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  uncollected_resources(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/uncollected_resources`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  twitterQueries(id, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/twitter_queries`,
      method: "GET",
      options: {
        params: { page }
      }
    };
  },

  versions(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/versions`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  contentBlocks(id) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/content_blocks`,
      method: "GET"
    };
  },

  actionCallouts(id) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/action_callouts`,
      method: "GET"
    };
  },

  featured(limit = 6, filterParams = {}) {
    const filter = filterParams;
    filter.featured = true;
    const page = { limit };
    return {
      endpoint: "/api/v1/projects",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  }
};
