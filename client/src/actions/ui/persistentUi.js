import { createAction } from "redux-actions";

export const setPersistentUI = createAction(
  "SET_PERSISTENT_UI",
  userPersistentUi => userPersistentUi
);
