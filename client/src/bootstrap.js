import has from "lodash/has";
import ch from "helpers/consoleHelpers";
import { entityStoreActions } from "actions";
import { authenticateWithAuthToken } from "store/middleware/currentUserMiddleware";

const { request } = entityStoreActions;
import { settingsAPI, requests } from "api";

// Currently, the Manifold Bootstrap does two things:
// 1. Load the settings.
// 2. Authenticate the user from a cookie.
export default function bootstrap(getState, dispatch, cookieHelper, location) {
  const promises = [];
  const state = getState();
  const authToken = cookieHelper.read("authToken") || new URLSearchParams(location.search).get("authToken");

  // TODO: exchange tokens & clear URL param after it's used

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
        ch.notice("Settings loaded", "control_knobs");
      },
      () => {
        ch.error("Settings failed to load");
      }
    );
    promises.push(settingsPromise);
  }

  // Authenticate from cookie.
  const authPromiseWrapper = new Promise((resolve, rejectIgnored) => {
    // Whether or not we can authenticate the user, we successfully resolve the promise,
    // because an unauthenticated user is not the same as a failed request.
    const authPromise = authenticateWithAuthToken(dispatch, cookieHelper, authToken);
    authPromise.then(
      () => {
        ch.notice("User authenticated", "wink");
        resolve();
      },
      () => {
        ch.notice("Unable to authenticate user", "rage");
        resolve();
      }
    );
  });
  promises.push(authPromiseWrapper);

  return Promise.all(promises);
}
