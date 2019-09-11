import { handleActions } from "redux-actions";

const getInitialState = () => ({
  font: "serif",
  fontSize: {
    current: 3,
    max: 6,
    min: 0
  },
  margins: {
    current: 1,
    max: 4,
    min: 0
  }
});

export const initialState = getInitialState();

const selectFont = (state, action) => {
  return { ...state, font: action.payload };
};

// TODO: get nested attributes to reset to initialState
const resetAllAttributes = () => getInitialState();

const incrementAttribute = (state, attribute) => {
  const parameter = state[attribute];
  if (parameter.current < parameter.max) {
    parameter.current += 1;
  }
  return { ...state, [attribute]: parameter };
};

const decrementAttribute = (state, attribute) => {
  const parameter = state[attribute];
  if (parameter.current > parameter.min) {
    parameter.current -= 1;
  }
  return { ...state, [attribute]: parameter };
};

const setPersistentUI = (state, action) => {
  return { ...getInitialState(), ...action.payload.typography };
};

export default handleActions(
  {
    SET_PERSISTENT_UI: setPersistentUI,
    SELECT_FONT: selectFont,
    INCREMENT_FONT_SIZE: state => {
      return incrementAttribute(state, "fontSize");
    },
    DECREMENT_FONT_SIZE: state => {
      return decrementAttribute(state, "fontSize");
    },
    INCREMENT_MARGINS: state => {
      return incrementAttribute(state, "margins");
    },
    DECREMENT_MARGINS: state => {
      return decrementAttribute(state, "margins");
    },
    RESET_TYPOGRAPHY: resetAllAttributes
  },
  getInitialState()
);
