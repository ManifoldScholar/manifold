import { requests, meAPI } from "api";
import { entityStoreActions } from "actions";
import isEqual from "lodash/isEqual";

const { request } = entityStoreActions;

export default function onUserIsCurrentUserUpdate(store) {
  let currentState = store.getState();
  let lastState;
  return () => {
    lastState = currentState;
    currentState = store.getState();
    const currentUser = currentState.authentication.currentUser;
    if (!currentUser) return;
    if (
      !lastState.entityStore.entities.users ||
      !currentState.entityStore.entities.users
    )
      return;
    const lastStateUser = lastState.entityStore.entities.users[currentUser.id];
    const currentStateUser =
      currentState.entityStore.entities.users[currentUser.id];
    if (!lastStateUser || !currentStateUser) return;
    if (isEqual(lastStateUser.attributes, currentStateUser.attributes)) return;
    store.dispatch(request(meAPI.show(), requests.gAuthenticatedUserUpdate));
  };
}
