export default {
  index(filter = {}, page = {}, unpaginated = null) {
    const params = { filter, page };
    if (unpaginated) {
      params.unpaginated = unpaginated;
    }
    return {
      endpoint: "/api/v1/subjects",
      method: "GET",
      options: { params }
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
