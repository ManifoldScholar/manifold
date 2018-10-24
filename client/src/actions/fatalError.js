import { createAction } from "redux-actions";

export const types = {
  api: "API",
  authorization: "AUTHORIZATION",
  page_not_found: "PAGE_NOT_FOUND"
};

export const setFatalError = createAction("SET_FATAL_ERROR", (error, type) => {
  return { error, type };
});

export const trigger404 = createAction("SET_FATAL_ERROR", () => {
  return {
    error: {
      status: 404,
      heading: "Page not found",
      body: "The requested URL does not exist."
    },
    type: types.page_not_found
  };
});
