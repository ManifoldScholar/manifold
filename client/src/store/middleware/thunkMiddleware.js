export default function thunkMiddleware({ dispatch, getState }) {
  return next => action => {
    if (typeof action === "function") {
      action(dispatch, getState);
    } else {
      return next(action);
    }
  };
}
