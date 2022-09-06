import actions from "actions/currentUser";
import { ApiClient, tokensAPI, meAPI } from "api";
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

export function handleAuthenticationSuccess(
  dispatch,
  options = { authToken: null, user: null, cookieHelper: null, setCookie: true }
) {
  dispatch(actions.setCurrentUser(options.user));
  dispatch(actions.setAuthToken(options.authToken));
  dispatch(actions.loginComplete());
  if (options.setCookie) setCookie(options.authToken, options.cookieHelper);
  return Promise.resolve();
}

export function handleAuthenticationFailure(
  dispatch,
  options = { status: 500, cookieHelper: null, destroyCookie: true }
) {
  dispatch(actions.loginSetError(generateErrorPayload(options.status)));
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
  return new Promise((resolve, reject) => {
    getUserFromToken(authToken).then(
      user => {
        handleAuthenticationSuccess(dispatch, {
          authToken,
          user,
          setCookie: true
        }).finally(() => {
          resolve();
        });
      },
      response => {
        const { status } = response;
        handleAuthenticationFailure(dispatch, { status, destroyCookie: true });
        reject();
      }
    );
  });
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

  return new Promise((resolve, reject) => {
    getUserFromToken(authToken).then(
      user => {
        handleAuthenticationSuccess(dispatch, {
          authToken,
          user,
          cookieHelper,
          setCookie: false
        }).finally(() => {
          resolve();
        });
      },
      response => {
        const { status } = response;
        handleAuthenticationFailure(dispatch, {
          status,
          cookieHelper,
          destroyCookie: `${status}`[0] !== 5
        });
        reject();
      }
    );
  });
}

export default function currentUserMiddleware({ dispatch }) {
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
    }

    return next(action);
  };
}
