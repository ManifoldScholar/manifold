export default {

  // favoritable arg is { type: 'type', id: 1 }
  create(favoritable) {
    return {
      endpoint: '/api/v1/me/relationships/favorites',
      method: 'POST',
      options: {
        params: {
          data: {
            type: "favorites",
            relationships: {
              favoritable: {
                data: favoritable
              }
            }
          }
        }
      }
    };
  },

  destroy(favoriteId) {
    return {
      endpoint: `/api/v1/me/relationships/favorites/${favoriteId}`,
      method: 'DELETE',
      options: {}
    };
  }


};
