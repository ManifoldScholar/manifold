import { handleActions } from "redux-actions";

const initialState = {
  plugins: [],
  components: {}
};

function registerPlugin(state, { payload }) {
  if (state.plugins.includes(payload.plugin)) return state;
  const plugins = state.plugins.slice(0);
  plugins.push(payload.plugin);
  return { ...state, plugins };
}

function registerComponent(state, { payload }) {
  const components = { ...state.components };
  components[payload.region] = payload;
  return { ...state, components };
}

export default handleActions(
  {
    REGISTER_PLUGIN: registerPlugin,
    REGISTER_COMPONENT: registerComponent
  },
  initialState
);
