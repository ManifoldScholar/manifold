import has from "lodash/has";
import ch from "helpers/consoleHelpers";
import { entityStoreActions, currentUserActions } from "actions";

const { request } = entityStoreActions;
import { settingsAPI, requests } from "api";

export default function bootstrap(getState, dispatch, cookie) {
  const promises = [];
  const state = getState();

  // Load settings if they have not already been loaded.
  const loaded = has(state, "entityStore.entities.settings.0");
  if (!loaded) {
    const settingsRequest = request(settingsAPI.show(), requests.settings, {
      oneTime: true
    });
    const settingsPromise = dispatch(settingsRequest).promise;
    settingsPromise.then(
      () => {
        ch.plain("Settings loaded");
      },
      () => {
        ch.plain("Settings failed to load");
      }
    );
    promises.push(settingsPromise);
  }

  // Authenticate from cookie.
  if (cookie && !state.authentication.authenticated) {
    const authToken = cookie.authToken;
    if (authToken) {
      const authPromise = dispatch(currentUserActions.login({ authToken }));
      authPromise.then(
        () => {
          ch.plain("User authenticated");
        },
        () => {
          ch.plain("Unable to authenticate user");
        }
      );
      promises.push(authPromise);
    }
  }

  return Promise.all(promises);
}
