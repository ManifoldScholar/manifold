export default {
  index() {
    return {
      endpoint: "/api/v1/lti/registrations",
      method: "GET",
      options: {}
    };
  },

  approve(id) {
    return {
      endpoint: `/api/v1/lti/registrations/${id}/approve`,
      method: "PUT",
      options: {}
    };
  },

  deny(id) {
    return {
      endpoint: `/api/v1/lti/registrations/${id}/deny`,
      method: "PUT",
      options: {}
    };
  },

  block(id) {
    return {
      endpoint: `/api/v1/lti/registrations/${id}/block`,
      method: "PUT",
      options: {}
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/lti/registrations/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
