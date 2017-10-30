export default {
  index(filter = {}) {
    return {
      endpoint: "/api/v1/subjects",
      method: "GET",
      options: {
        params: { filter }
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

  show(id) {
    return {
      endpoint: `/api/v1/subjects/${id}`,
      method: "GET",
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
