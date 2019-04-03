import { createAction } from "redux-actions";

export const takeSnapshot = createAction("TAKE_SNAPSHOT", (key, snapshot) => ({
  key,
  snapshot
}));

export const resetSnapshot = createAction("RESET_SNAPSHOT", key => key);

export const resetSnapshots = createAction("RESET_SNAPSHOTS");
