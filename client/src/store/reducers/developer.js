import { handleActions } from "redux-actions";

const initialState = {
  renderDevTools: false
};

const renderDevTools = () => {
  return { renderDevTools: true };
};

export default handleActions(
  {
    RENDER_DEV_TOOLS: renderDevTools
  },
  initialState
);
