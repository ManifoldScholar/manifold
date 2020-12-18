import has from "lodash/has";
import ch from "helpers/consoleHelpers";
import { entityStoreActions } from "actions";
import { authenticateWithCookie } from "store/middleware/currentUserMiddleware";

const { request } = entityStoreActions;
import { settingsAPI, requests } from "api";

// Currently, the Manifold Bootstrap (aka "Initialization") does two things:
// 1. Load the settings.
// 2. Authenticate the user from a cookie.
// This process is universal, and can be called on the server or the browser.
export default function bootstrap(getState, dispatch, cookieHelper) {
  const promises = [];
  const state = getState();
  const authToken = cookieHelper.read("authToken");

  // Load settings if they have not already been loaded.
  const loaded = has(state, "entityStore.entities.settings.0");
  if (!loaded) {
    const settingsRequest = request(
      settingsAPI.show({ authToken }),
      requests.settings,
      {
        oneTime: true
      }
    );
    const settingsPromise = dispatch(settingsRequest).promise;
    settingsPromise.then(
      () => {
        ch.notice("Initialization: settings loaded", "ok_hand");
      },
      () => {
        ch.error("Initialization: settings failed to load");
      }
    );
    promises.push(settingsPromise);
  }

  // Authenticate from cookie.
  const authPromiseWrapper = new Promise((resolve, rejectIgnored) => {
    // Whether or not we can authenticate the user, we successfully resolve the promise,
    // because an unauthenticated user is not the same as a failed request.
    const authPromise = authenticateWithCookie(dispatch, cookieHelper);
    authPromise.then(
      () => {
        ch.notice("Initialization: user authenticated", "ok_hand");
        resolve();
      },
      () => {
        ch.notice("Initialization: unable to authenticate user", "thumbsdown");
        resolve();
      }
    );
  });
  promises.push(authPromiseWrapper);

  return Promise.all(promises);
}
