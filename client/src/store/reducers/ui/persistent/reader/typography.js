import { handleActions } from "redux-actions";

export const initialState = {
  font: "serif",
  fontSize: {
    current: 3,
    max: 5,
    min: 0
  },
  margins: {
    current: 1,
    max: 2,
    min: 0
  }
};

const selectFont = (state, action) => {
  return Object.assign({}, state, { font: action.payload });
};

const incrementAttribute = (state, attribute) => {
  const parameter = state[attribute];
  if (parameter.current < parameter.max) {
    parameter.current += 1;
  }
  return Object.assign({}, state, { [attribute]: parameter });
};

const decrementAttribute = (state, attribute) => {
  const parameter = state[attribute];
  if (parameter.current > parameter.min) {
    parameter.current -= 1;
  }
  return Object.assign({}, state, { [attribute]: parameter });
};

const setPersistentUI = (state, action) => {
  return Object.assign({}, initialState, action.payload.typography);
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
    }
  },
  initialState
);
