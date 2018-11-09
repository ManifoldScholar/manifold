export default {
  index(filter = {}) {
    const params = { filter };

    return {
      endpoint: `/api/v1/tags`,
      method: "GET",
      options: { params }
    };
  }
};
