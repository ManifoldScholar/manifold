import { currentUserActions } from "../../actions";

export const startSession = (dispatch, user) => {
  dispatch(currentUserActions.setCurrentUser({ data: user }));
};

export const endSession = dispatch => {
  dispatch(currentUserActions.logout());
};
