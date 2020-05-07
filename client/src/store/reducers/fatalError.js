import { types } from "actions/fatalError";
import endsWith from "lodash/endsWith";

const initialState = {
  error: null,
  type: null
};

const clearError = state => {
  return { ...state, ...initialState };
};

const mapAPIError = ({ status, error, exception, traces }) => {
  let body = null;
  if (status === 502)
    body = "The Manifold client application can't communicate with the API.";
  try {
    if (exception) body = exception.match(/(?:^#<|^)(.*)(?:>$|$)/)[1];
    if (endsWith(body, ">")) body = body.substring(0, body.length - 1);
  } catch (e) {
    body = exception;
  }
  return {
    status,
    heading: `API ${error}`,
    body,
    apiTrace: traces
  };
};

const mapAuthorizationError = ({ status, heading, body, project, method }) => {
  return {
    status,
    method,
    heading,
    body,
    project,
    apiTrace: null
  };
};

const setError = (state, { payload: { error: rawError, type } }) => {
  const error = (e => {
    switch (type) {
      case types.api:
        return mapAPIError(e);
      case types.authorization:
        return mapAuthorizationError(e);
      default:
        return e;
    }
  })(rawError);
  return { ...state, error, type };
};

const fatalErrorReducer = (state = initialState, action) => {
  if (action.type === "ROUTE_UPDATE" && state.error) {
    return clearError(state, action);
  }

  switch (action.type) {
    case "SET_FATAL_ERROR":
      return setError(state, action);
    default:
      return state;
  }
};

export default fatalErrorReducer;
