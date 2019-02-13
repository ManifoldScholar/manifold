import actions from "actions/currentUser";
import { ApiClient, tokensAPI, meAPI, favoritesAPI } from "api";
import { notificationActions } from "actions";

function generateErrorPayload(status = 401) {
  const heading = "Login Failed";
  let level;
  let body;
  switch (status) {
    case 502:
    case 500:
      level = 2;
      body =
        "The server was unreachable, or unable to fulfill your request. If" +
        " you are sure that you are online, perhaps there is a problem with the Manifold " +
        "backend";
      break;
    default:
      level = 1;
      body = "The username or password you entered is incorrect";
      break;
  }
  return { id: "LOGIN_NOTIFICATION", level, heading, body };
}

function notifyLogout(dispatch) {
  const notification = {
    level: 0,
    id: "AUTHENTICATION_STATE_CHANGE",
    heading: "You have logged out successfully."
  };
  dispatch(notificationActions.addNotification(notification));
  setTimeout(() => {
    dispatch(notificationActions.removeNotification(notification.id));
  }, 5000);
}

function authenticateWithPassword(email, password, dispatch) {
  const promise = tokensAPI.createToken(email, password);
  promise.then(
    response => {
      const authToken = response.meta.authToken;
      if (!authToken) {
        dispatch(actions.loginSetError(generateErrorPayload(500)));
        dispatch(actions.loginComplete());
        return Promise.resolve();
      }
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 90);
      if (document) {
        document.cookie = `authToken=${authToken};path=/;expires=${expireDate.toUTCString()}`;
      }
      dispatch(actions.setCurrentUser(response));
      dispatch(actions.setAuthToken(authToken));
      dispatch(actions.loginComplete());
    },
    response => {
      dispatch(actions.loginSetError(generateErrorPayload(response.status)));
      dispatch(actions.loginComplete());
    }
  );

  return promise;
}

export function authenticateWithToken(token, dispatch) {
  const client = new ApiClient();

  // Query API for current user from token
  let promise;
  if (token) {
    const { endpoint, method, options } = meAPI.show();
    options.authToken = token;
    promise = client.call(endpoint, method, options);
  } else {
    promise = new Promise((resolve, reject) => reject());
  }

  promise.then(
    response => {
      dispatch(actions.setCurrentUser(response));
      dispatch(actions.setAuthToken(token));
      dispatch(actions.loginComplete());
    },
    responseIgnored => {
      dispatch(actions.logout);
    }
  );

  return promise;
}

function destroyCookie() {
  if (document) {
    document.cookie = "authToken=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

function follow(project, token, dispatch) {
  const client = new ApiClient();
  const { endpoint, method, options } = favoritesAPI.create(project);
  options.authToken = token;
  const promise = client.call(endpoint, method, options);
  dispatch(actions.updateCurrentUser(promise));
}

function unfollow(target, token, dispatch) {
  const { favoritableId, favoriteId } = target;
  const client = new ApiClient();
  const { endpoint, method, options } = favoritesAPI.destroy(favoriteId);
  options.authToken = token;
  const promise = new Promise((resolve, reject) => {
    client.call(endpoint, method, options).then(
      () => {
        resolve(favoritableId);
      },
      response => {
        reject(response);
      }
    );
  });
  dispatch(actions.deleteCurrentUserFavorite(promise));
}

export default function currentUserMiddleware({ dispatch, getState }) {
  return next => action => {
    const payload = action.payload;

    if (action.type === "LOGIN") {
      dispatch(actions.loginStart());
      if (payload.authToken) {
        return authenticateWithToken(payload.authToken, dispatch);
      }
      authenticateWithPassword(payload.email, payload.password, dispatch);
    }

    if (action.type === "LOGOUT") {
      destroyCookie();
      notifyLogout(dispatch);
    }

    if (action.type === "FOLLOW") {
      follow(payload, getState().authentication.authToken, dispatch);
    }

    if (action.type === "UNFOLLOW") {
      unfollow(payload, getState().authentication.authToken, dispatch);
    }

    return next(action);
  };
}
