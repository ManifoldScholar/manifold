import { createAction } from 'redux-actions';

// Target is a reference to a model with the form of: { id, type }
export const follow = createAction('FOLLOW', target => target);

// FavoritableId = the ID of the object being unfavorited
// FavoriteId = the ID of the favorite record being deleted
export const unfollow =
  createAction('UNFOLLOW', (favoritableId, favoriteId) => ({ favoritableId, favoriteId }));

// The login hash can be an auth token (string) or a an { email, password } object.
export const login = createAction('LOGIN', loginHash => loginHash);

// Fired when login begins
export const loginStart = createAction('LOGIN_START');

// Fired when login is completed
export const loginComplete = createAction('LOGIN_COMPLETE');

// Notification payload
export const loginSetError = createAction('LOGIN_SET_ERROR', notification => notification);

// No payload necessary
export const logout = createAction('LOGOUT');

// A user model or promise returned from the API
export const setCurrentUser = createAction('LOGIN_SET_CURRENT_USER', user => user);

// Auth token is a string
export const setAuthToken = createAction('LOGIN_SET_AUTH_TOKEN', authToken => authToken);

// A user model or promise returned from the API
export const updateCurrentUser = createAction('UPDATE_CURRENT_USER', user => user);

// The ID of the object that is no longer favorited
export const deleteCurrentUserFavorite =
  createAction('DELETE_CURRENT_USER_FAVORITE', favoritableId => favoritableId);

export default {
  follow,
  unfollow,
  login,
  loginStart,
  loginComplete,
  loginSetError,
  logout,
  setCurrentUser,
  setAuthToken,
  updateCurrentUser,
  deleteCurrentUserFavorite
};
