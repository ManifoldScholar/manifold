import authenticationReducer from "../authentication";

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
    collection: null
  }
};

const response = {
  data: user,
  included: []
};

const initialState = {
  authenticated: false,
  authenticating: false,
  authToken: null,
  currentUser: null,
  error: null,
  visitToken: null,
  visitorToken: null
};

describe("store/reducers/authentication", () => {
  it("should return the initial state", () => {
    const state = authenticationReducer(undefined, {
      type: "SOME_UNRELATED_ACTION"
    });
    expect(state).toEqual(initialState);
  });

  it("Update the current user in response to an update-current-user request", () => {
    const action = {
      type: "UPDATE_CURRENT_USER",
      payload: { data: user }
    };

    const startState = Object.assign({}, initialState, { authenticated: true });

    const state = authenticationReducer(startState, action);
    expect(state).toEqual(
      Object.assign({}, startState, {
        currentUser: {
          id: user.id,
          type: user.type,
          attributes: user.attributes,
          relationships: { collection: null }
        }
      })
    );
  });

  it("Updates state.authentication.authenticating to true when login is started", () => {
    const action = { type: "LOGIN" };
    const state = authenticationReducer(initialState, action);
    expect(state.authenticating).toBe(true);
  });

  it("Restores the initial state after handling START_LOGOUT", () => {
    const action = { type: "LOGOUT" };
    const state = authenticationReducer({ authenticated: true }, action);
    expect(state).toEqual(initialState);
  });

  it("Sets the authentication token in response to SET_AUTH_TOKEN", () => {
    const token = "a_fake_auth_token";
    const action = { type: "LOGIN_SET_AUTH_TOKEN", payload: token };
    const state = authenticationReducer(initialState, action);
    expect(state.authToken).toEqual(token);
  });

  it("Update the current user in response to SET_CURRENT_USER", () => {
    const action = {
      type: "LOGIN_SET_CURRENT_USER",
      payload: { data: user }
    };
    const state = authenticationReducer(initialState, action);
    expect(state).toEqual(
      Object.assign({}, initialState, {
        authenticated: true,
        currentUser: {
          id: user.id,
          type: user.type,
          attributes: user.attributes,
          relationships: { collection: null }
        }
      })
    );
  });
});
