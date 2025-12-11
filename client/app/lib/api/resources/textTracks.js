export default {
  index(resourceId) {
    return {
      endpoint: `/api/v1/resources/${resourceId}/relationships/text_tracks`,
      method: "GET"
    };
  },

  create(resourceId, track) {
    return {
      endpoint: `/api/v1/resources/${resourceId}/relationships/text_tracks`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "text_tracks", data: track })
      }
    };
  },

  update(resourceId, trackId, track) {
    return {
      endpoint: `/api/v1/resources/${resourceId}/relationships/text_tracks/${trackId}`,
      method: "PUT",
      options: {
        body: JSON.stringify({ type: "text_tracks", data: track })
      }
    };
  },

  show(resourceId, trackId) {
    return {
      endpoint: `/api/v1/resources/${resourceId}/relationships/text_tracks/${trackId}`,
      method: "GET"
    };
  },

  destroy(resourceId, trackId) {
    return {
      endpoint: `/api/v1/resources/${resourceId}/relationships/text_tracks/${trackId}`,
      method: "DELETE"
    };
  }
};
