import authenticationReducer from '../authentication';

const user = {
  id: "11111111-1111-1111-1111-111111111111",
  type: "users",
  attributes: {
    email: "user@user.com",
    nickname: "Banana",
    firstName: "Zach",
    lastName: "Davis",
    role: null
  },
  relationships: {
    favorites: {
      data: [
        {
          id: "22222222-2222-2222-2222-222222222222",
          type: "favorites"
        }
      ]
    }
  }
}

const favorite = {
  id: "22222222-2222-2222-2222-222222222222",
  type: "favorites",
  attributes: {
    favoritableId: "33333333-3333-3333-3333-333333333333",
    favoritableType: "Project"
  },
  relationships: {
    favoritable: {
      data: {
        id: "abc",
        type: "projects",
      }
    }
  }
}

const response = {
  data: user,
  included: [favorite]
};

const initialState = {
  authenticated: false,
  authenticating: false,
  authToken: null,
  currentUser: null,
  error: null
}

describe('store/reducers/authentication', () => {

  it('should return the initial state', () => {
    const state = authenticationReducer(undefined, {type: "SOME_UNRELATED_ACTION"});
    expect(state).toEqual(initialState);
  });

  it('Update the current user in response to an update-current-user request', ()=> {
    const action = {
      type: 'ENTITY_STORE_RESPONSE',
      meta: "update-current-user",
      payload: { data: user }
    };
    const state = authenticationReducer(initialState, action);
    expect(state).toEqual(Object.assign({}, initialState, { currentUser: {
      id: user.id,
      type: user.type,
      attributes: user.attributes,
      favorites: {}
    }}));
  });

  it('Updates state.authentication.authenticating to true when login is started', () => {
    const action = { type: "START_LOGIN" }
    const state = authenticationReducer(initialState, action);
    expect(state.authenticating).toBe(true);
  });

  it('Updates state.authentication.authenticating to true when login is started', () => {
    const action = { type: "START_LOGIN" }
    const state = authenticationReducer(
      Object.assign({},
        initialState,
        { authenticated: true }
      ), action);
    expect(state.authenticated).toBe(false);
  });

  it('Restores the initial state after handling START_LOGOUT', () => {
    const action = { type: "START_LOGOUT" };
    const state = authenticationReducer({ authenticated: true }, action);
    expect(state).toEqual(initialState);
  });

  it('Sets the authentication token in response to SET_AUTH_TOKEN', () => {
    const token = 'a_fake_auth_token';
    const action = { type: "SET_AUTH_TOKEN", payload: token };
    const state = authenticationReducer(initialState, action);
    expect(state.authToken).toEqual(token);
  });

  it('Update the current user in response to an update-current-user request', () => {
    const token = 'a_fake_auth_token';
    const action = { type: "SET_AUTH_TOKEN", payload: token };
    const state = authenticationReducer(initialState, action);
    expect(state.authToken).toEqual(token);
  });

  it('Update the current user in response to SET_CURRENT_USER', ()=> {
    const action = {
      type: 'SET_CURRENT_USER',
      payload: { data: user }
    };
    const state = authenticationReducer(initialState, action);
    expect(state).toEqual(Object.assign({}, initialState, { currentUser: {
      id: user.id,
      type: user.type,
      attributes: user.attributes,
      favorites: {}
    }}));
  });

  it('Transforms the user\'s favorites into a hash that is keyed by the favoritable UUID', ()=> {
    const action = {
      type: 'SET_CURRENT_USER',
      payload: response
    };
    const state = authenticationReducer(initialState, action);
    const favoritableId = favorite.attributes.favoritableId;
    expect(state.currentUser.favorites[favoritableId]).toBe(favorite);
  });

});


