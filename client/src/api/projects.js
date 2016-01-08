export default {

  projects(filter = {}, page = {}) {
    return {
      endpoint: '/api/v1/projects',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  project(id) {
    return {
      endpoint: `/api/v1/projects/${id}`,
      method: 'GET',
      options: {
      }
    };
  },

  filteredProjects(filter = {}, page = {}) {
    return {
      endpoint: '/api/v1/projects',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  featuredProjects(limit = 6) {
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

  testProjects(filter = {}, page = {}) {
    return {
      endpoint: '/api/v1/projects',
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  }

};
