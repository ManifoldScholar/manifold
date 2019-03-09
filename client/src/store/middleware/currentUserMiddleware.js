import actions from "actions/currentUser";
import { ApiClient, tokensAPI, meAPI, favoritesAPI } from "api";
import { notificationActions } from "actions";
import BrowserCookieHelper from "helpers/cookie/Browser";

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

function setCookie(authToken, cookieHelper = null) {
  const cookie = cookieHelper || new BrowserCookieHelper();
  cookie.write("authToken", authToken);
}

function destroyCookie(cookieHelper = null) {
  const cookie = cookieHelper || new BrowserCookieHelper();
  cookie.remove("authToken");
}

function getUserFromToken(token) {
  const client = new ApiClient();
  if (token) {
    const { endpoint, method, options } = meAPI.show();
    options.authToken = token;
    return client.call(endpoint, method, options);
  }
  return Promise.reject();
}

function handleAuthenticationSuccess(
  dispatch,
  options = { authToken: null, user: null, cookieHelper: null, setCookie: true }
) {
  dispatch(actions.setCurrentUser(options.user));
  dispatch(actions.setAuthToken(options.authToken));
  dispatch(actions.loginComplete());
  if (options.setCookie) setCookie(options.authToken, options.cookieHelper);
}

function handleAuthenticationFailure(
  dispatch,
  options = { status: 500, cookieHelper: null, destroyCookie: true }
) {
  dispatch(actions.loginSetError(generateErrorPayload(500)));
  dispatch(actions.loginComplete());
  if (options.destroyCookie) destroyCookie(options.cookieHelper);
}

function authenticateWithPassword(email, password, dispatch) {
  const promise = tokensAPI.createToken(email, password);
  promise.then(
    user => {
      const { authToken } = user.meta;
      if (!authToken) {
        handleAuthenticationFailure(dispatch, {
          status: 500,
          destroyCookie: true
        });
        return Promise.resolve();
      }
      handleAuthenticationSuccess(dispatch, {
        authToken,
        user,
        setCookie: true
      });
    },
    response => {
      const { status } = response;
      handleAuthenticationFailure(dispatch, { status, destroyCookie: true });
    }
  );
  return promise;
}

function authenticateWithToken(authToken, dispatch) {
  const promise = getUserFromToken(authToken);
  promise.then(
    user => {
      handleAuthenticationSuccess(dispatch, {
        authToken,
        user,
        setCookie: true
      });
    },
    response => {
      const { status } = response;
      handleAuthenticationFailure(dispatch, { status, destroyCookie: true });
    }
  );
  return promise;
}

// This function can be called on the server or the client. It's called outside of the
// normal dispatch process during bootstrap, because it needs access to complex objects
// that can't be dispatched, such as the browser and server cookie helpers. The server-
// side cookie helper needs access to the current response to set the cookie, and that
// would be difficult to pass through the store. That said, we keep this in the middleware
// so as not to spread and duplicate this authenticate logic. Yeah, it's kind of a
// one-off. We're sorry.
export function authenticateWithCookie(dispatch, cookieHelper) {
  const authToken = cookieHelper.read("authToken");
  if (!authToken) return Promise.reject();
  const promise = getUserFromToken(authToken);
  promise.then(
    user => {
      handleAuthenticationSuccess(dispatch, {
        authToken,
        user,
        cookieHelper,
        setCookie: false
      });
    },
    response => {
      const { status } = response;
      handleAuthenticationFailure(dispatch, {
        status,
        cookieHelper,
        destroyCookie: true
      });
    }
  );
  return promise;
}

export default function currentUserMiddleware({ dispatch, getState }) {
  return next => action => {
    const payload = action.payload;

    if (action.type === "RESTORE_SESSION") {
      dispatch(actions.loginStart());
      return authenticateWithCookie(payload, dispatch);
    }

    if (action.type === "LOGIN") {
      dispatch(actions.loginStart());
      if (payload.authToken) {
        authenticateWithToken(payload.authToken, dispatch);
      } else {
        authenticateWithPassword(payload.email, payload.password, dispatch);
      }
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
