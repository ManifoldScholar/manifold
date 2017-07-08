import { handleActions } from "redux-actions";

const initialState = {
  loadState: "NOT_LOADED"
};

const serverLoaded = () => {
  return {
    loadState: "SERVER_LOADED"
  };
};

const clientLoaded = () => {
  return {
    loadState: "CLIENT_LOADED"
  };
};

export default handleActions(
  {
    SERVER_LOADED: serverLoaded,
    CLIENT_LOADED: clientLoaded
  },
  initialState
);
