export default {
  index() {
    return {
      endpoint: "/api/v1/lti/registrations",
      method: "GET",
      options: {}
    };
  },

  update(id, ltiRegistration) {
    return {
      endpoint: `/api/v1/lti/registrations/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({
          type: "lti_registrations",
          data: ltiRegistration
        })
      }
    };
  },

  destroy(id, blocklist = false) {
    return {
      endpoint: `/api/v1/lti/registrations/${id}`,
      method: "DELETE",
      options: {
        params: { blocklist }
      }
    };
  }
};
