import isString from "lodash/isString";

export default {
  adminIndex(filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/comments`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  index(subject, filter = {}, page = {}) {
    return {
      endpoint: `/api/v1/${subject.type}/${subject.id}/relationships/comments`,
      method: "GET",
      options: {
        params: { filter, page }
      }
    };
  },

  create(subject, comment) {
    const data = { attributes: comment };
    return {
      endpoint: `/api/v1/${subject.type}/${subject.id}/relationships/comments`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "comments", data })
      }
    };
  },

  show(id) {
    return {
      endpoint: `/api/v1/comments/${id}`,
      method: "GET",
      options: {}
    };
  },

  update(id, comment) {
    const data = { attributes: comment };
    return {
      endpoint: `/api/v1/comments/${id}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "comments", data })
      }
    };
  },

  destroy(comment) {
    const id = isString(comment) ? comment : comment.id;
    return {
      endpoint: `/api/v1/comments/${id}`,
      method: "DELETE",
      options: {}
    };
  },

  flag(comment) {
    const id = isString(comment) ? comment : comment.id;
    return {
      endpoint: `/api/v1/comments/${id}/relationships/flags`,
      method: "POST",
      options: {}
    };
  },

  unflag(comment) {
    const id = isString(comment) ? comment : comment.id;
    return {
      endpoint: `/api/v1/comments/${id}/relationships/flags`,
      method: "DELETE",
      options: {}
    };
  },

  resolveAllFlags(commentId) {
    return {
      endpoint: `/api/v1/comments/${commentId}/relationships/flags/resolve_all`,
      method: "DELETE",
      options: {}
    };
  }
};
