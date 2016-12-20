export default {

  index(filter = {}, page = {}) {
    return {
      endpoint: '/api/v1/projects',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  create(project) {
    return {
      endpoint: '/api/v1/projects',
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "project", data: project })
      }
    };
  },

  update(id, project) {
    return {
      endpoint: `/api/v1/projects/${id}`,
      method: 'PUT',
      options: {
        body: JSON.stringify({ type: "project", data: project })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/projects/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  events(id, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/events`,
      method: 'GET',
      options: {
        params: { page }
      }
    };
  },

  resources(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/resources`,
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  uncollected_resources(id, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/projects/${id}/relationships/uncollected_resources`,
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },


  featured(limit = 6) {
    const filter = { featured: true };
    const page = { limit };
    return {
      endpoint: '/api/v1/projects',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

};
