import { requests, meAPI } from "api";
import { entityStoreActions, currentUserActions } from "actions";
import get from "lodash/get";

const { request } = entityStoreActions;

function currentAuthUser(state) {
  if (!state || !state.authentication) return null;
  return state.authentication.currentUser;
}

function currentAuthUserId(state) {
  if (!currentAuthUser(state)) return null;
  return currentAuthUser(state).id;
}

function currentUserEntity(state) {
  if (!currentAuthUserId(state)) return null;
  const path = `entityStore.entities.users.${currentAuthUserId(state)}`;
  return get(state, path);
}

function currentUserCollectionEntity(state) {
  if (!currentAuthUserId(state)) return null;
  const path = `entityStore.entities.userCollections.${currentAuthUserId(
    state
  )}-collection`;
  return get(state, path);
}

function shouldRequestUserUpdate(lastState, currentState) {
  if (!currentAuthUser(currentState)) return false;
  if (!currentUserEntity(currentState)) return false;
  if (
    currentUserEntity(lastState) &&
    currentUserEntity(lastState).attributes.updatedAt ===
      currentUserEntity(currentState).attributes.updatedAt
  )
    return false;
  if (
    currentAuthUser(currentState).attributes.updatedAt ===
    currentUserEntity(currentState).attributes.updatedAt
  )
    return false;
  return true;
}

function shouldUpdateCurrentUserCollection(lastState, currentState) {
  if (!currentAuthUser(currentState)) return false;
  if (!currentUserCollectionEntity(currentState)) return false;
  if (
    currentUserCollectionEntity(lastState) &&
    currentUserCollectionEntity(lastState) ===
      currentUserCollectionEntity(currentState)
  )
    return false;
  return true;
}

function updateCurrentUserCollection(state, store) {
  store.dispatch(
    currentUserActions.replaceUserCollection(currentUserCollectionEntity(state))
  );
}

function requestAuthUserUpdate(store) {
  store.dispatch(request(meAPI.show(), requests.gAuthenticatedUserUpdate));
}

export default function onUserIsCurrentUserUpdate(store) {
  let currentState = store.getState();
  let lastState;

  return () => {
    lastState = currentState;
    currentState = store.getState();

    if (!currentAuthUser(currentState)) return;
    if (shouldRequestUserUpdate(lastState, currentState)) {
      requestAuthUserUpdate(store);
    }
    if (shouldUpdateCurrentUserCollection(lastState, currentState)) {
      updateCurrentUserCollection(currentState, store);
    }
  };
}
