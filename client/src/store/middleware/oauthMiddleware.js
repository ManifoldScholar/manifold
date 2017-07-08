import { oauthActions as O, currentUserActions as U } from "actions";
import { get } from "lodash";

function tryToSignIn(dispatch, event) {
  const authToken = get(event, "data.authToken");

  if (authToken) {
    dispatch(U.login({ authToken }));
  } else if (get(event, "data.failed")) {
    dispatch(O.fail(get(event, "data.errors")));
  } else {
    dispatch(O.cancel());
  }
}

export default function oauthMiddleware({ dispatch, getStateIgnored }) {
  return next => action => {
    switch (action.type) {
      case `${O.oauthResponse}`:
        tryToSignIn(dispatch, event);

        break;
      default:
        break;
    }

    return next(action);
  };
}
