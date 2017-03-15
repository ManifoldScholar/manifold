export default {

  index(subject, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/${subject.type}/${subject.id}/relationships/comments`,
      method: 'GET',
      options: {
        params: { filter, page }
      }
    };
  },

  create(subject, comment) {
    const data = { attributes: comment };
    return {
      endpoint: `/api/v1/${subject.type}/${subject.id}/relationships/comments`,
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "comments", data })
      }
    };
  }
};
