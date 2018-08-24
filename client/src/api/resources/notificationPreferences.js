export default {
  unsubscribe(token) {
    return {
      endpoint: `/api/v1/notification_preferences/relationships/unsubscribe`,
      method: "POST",
      options: { params: { token } }
    };
  }
};
