import {
  currentUserActions,
  uiVisibilityActions,
  notificationActions
} from "actions";
import { bindActionCreators } from "redux";

const {
  visibilityChange,
  visibilityToggle,
  visibilityHide,
  visibilityShow,
  panelToggle,
  panelHide,
  panelShow,
  showMyNotes
} = uiVisibilityActions;
const {
  addNotification,
  removeNotification,
  removeAllNotifications
} = notificationActions;

function b(action, dispatch) {
  return bindActionCreators(action, dispatch);
}

const commonActions = dispatch => {
  return {
    toggleSearchPanel: b(() => panelToggle("search"), dispatch),
    hideSearchPanel: b(() => panelHide("search"), dispatch),
    toggleUserPanel: b(() => panelToggle("user"), dispatch),
    hideUserPanel: b(() => panelHide("user"), dispatch),
    hideAppearancePanel: b(() => panelHide("appearance"), dispatch),
    hideVisibilityPanel: b(() => panelHide("visibility"), dispatch),
    hideNotesPanel: b(() => panelHide("notes"), dispatch),
    hideReaderReturnPanel: b(() => panelHide("readerReturn"), dispatch),
    toggleSignInUpOverlay: b(
      () => visibilityToggle("signInUpOverlay"),
      dispatch
    ),
    closeSignInUpOverlay: b(() => visibilityHide("signInUpOverlay"), dispatch),
    addNotification: b(opts => addNotification(opts), dispatch),
    removeNotification: b(opts => removeNotification(opts), dispatch),
    clearNotifications: b(removeAllNotifications, dispatch),
    logout: b(currentUserActions.logout, dispatch),
    visibilityChange: b(el => visibilityChange(el), dispatch),
    visibilityToggle: b(el => visibilityToggle(el), dispatch),
    visibilityHide: b(el => visibilityHide(el), dispatch),
    visibilityShow: b(el => visibilityShow(el), dispatch),
    showMyNotes: b(showMyNotes, dispatch),
    panelToggle: b(el => panelToggle(el), dispatch),
    panelHide: b(el => panelHide(el), dispatch),
    panelShow: b(el => panelShow(el), dispatch)
  };
};

export default commonActions;
