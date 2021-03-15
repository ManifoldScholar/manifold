import { requests, meAPI } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function updatePersistentUi(store) {
  let currentState = store.getState();
  let lastState;
  return () => {
    lastState = currentState;
    currentState = store.getState();
    if (
      currentState.ui.persistent !== lastState.ui.persistent &&
      currentState.authentication.authenticated
    ) {
      store.dispatch(
        request(
          meAPI.update({ persistent_ui: currentState.ui.persistent }),
          requests.gAuthenticatedUserUpdate
        )
      );
    }
  };
}
