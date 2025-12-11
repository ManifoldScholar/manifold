export default {
  update(id) {
    return {
      endpoint: `/api/v1/email_confirmations/${id}`,
      method: "PUT",
      options: {}
    };
  }
};
