export default {
  index(filter = {}, page = {}) {
    return {
      endpoint: "/api/v1/subjects",
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(subject) {
    return {
      endpoint: "/api/v1/subjects",
      method: "POST",
      options: {
        body: JSON.stringify({ type: "subjects", data: subject })
      }
    };
  },

  update(id, subject) {
    return {
      endpoint: `/api/v1/subjects/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "subjects", data: subject })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/subjects/${id}`,
      method: "GET",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/subjects/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  featuredSubjects() {
    const filter = { featured: true };
    return {
      endpoint: `/api/v1/subjects/`,
      method: "GET",
      options: {
        params: { filter }
      }
    };
  }
};
