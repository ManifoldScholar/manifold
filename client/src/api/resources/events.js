export default {
  destroy(id) {
    return {
      endpoint: `/api/v1/events/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
