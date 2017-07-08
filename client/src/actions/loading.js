import { createAction } from "redux-actions";

export const start = createAction("START_LOADING", meta => meta);
export const stop = createAction("STOP_LOADING", meta => meta);
