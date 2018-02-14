import { requests, meAPI } from "api";
import { entityStoreActions } from "actions";
import get from "lodash/get";

const { request } = entityStoreActions;

export default function onUserIsCurrentUserUpdate(store) {
  let currentState = store.getState();
  let lastState;
  return () => {
    lastState = currentState;
    currentState = store.getState();
    const authUser = currentState.authentication.currentUser;
    if (!authUser) return;
    const lookup = `entityStore.entities.users.${authUser.id}`;
    const lastUserEntity = get(lastState, lookup);
    if (!lastUserEntity) return;
    const currentUserEntity = get(currentState, lookup);
    if (!currentUserEntity) return;
    const lastUserEntityUpdatedAt = lastUserEntity.attributes.updatedAt;
    const curentUserEntityUpdatedAt = currentUserEntity.attributes.updatedAt;
    const authUserUpdatedAt = authUser.attributes.updatedAt;
    if (lastUserEntityUpdatedAt === curentUserEntityUpdatedAt) return;
    if (curentUserEntityUpdatedAt === authUserUpdatedAt) return;
    store.dispatch(request(meAPI.show(), requests.gAuthenticatedUserUpdate));
  };
}
