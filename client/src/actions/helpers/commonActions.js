import { authActions, uiVisibilityActions, notificationActions } from 'actions';
import { bindActionCreators } from 'redux';

const { startLogout } = authActions;
const {
  visibilityToggle,
  visibilityHide,
  visibilityShow,
  panelToggle,
  panelHide,
  panelShow
} = uiVisibilityActions;
const { addNotification, removeNotification, removeAllNotifications } = notificationActions;

function b(action, dispatch) {
  return bindActionCreators(action, dispatch);
}

const commonActions = (dispatch) => {
  return {
    toggleSearchPanel: b(() => panelToggle('search'), dispatch),
    toggleUserPanel: b(() => panelToggle('user'), dispatch),
    toggleSignInUpOverlay: b(() => visibilityToggle('signInUpOverlay'), dispatch),
    addNotification: b((opts) => addNotification(opts), dispatch),
    removeNotification: b((opts) => removeNotification(opts), dispatch),
    clearNotifications: b(removeAllNotifications, dispatch),
    logout: b(startLogout, dispatch),
    visibilityToggle: b((el) => visibilityToggle(el), dispatch),
    visibilityHide: b((el) => visibilityHide(el), dispatch),
    visibilityShow: b((el) => visibilityShow(el), dispatch),
    panelToggle: b((el) => panelToggle(el), dispatch),
    panelHide: b((el) => panelHide(el), dispatch),
    panelShow: b((el) => panelShow(el), dispatch)
  };
};

export default commonActions;
