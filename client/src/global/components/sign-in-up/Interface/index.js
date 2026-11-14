import React, { useState, useEffect } from "react";
import ForgotPassword from "../ForgotPasswordForm";
import Login from "../LoginForm";
import Logout from "../Logout";
import Update from "../EditProfileForm";
import Create from "../CreateUserForm";
import Terms from "../AcceptTerms";
import { useFromStore, useAccountLink } from "hooks";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const VIEW_COMPONENT = {
  terms: Terms,
  create: Create,
  update: Update,
  "create-update": Update,
  login: Login,
  logout: Logout,
  password: ForgotPassword
};

export default function SignInUpInterface({
  defaultView = "login",
  showLogout = false,
  hideOverlay
}) {
  const authentication = useFromStore({ path: "authentication" });
  const location = useLocation();
  const { isLinking } = useAccountLink();

  const [view, setView] = useState(defaultView);

  const searchParams = new URLSearchParams(location?.search);
  const redirectUri = searchParams.get("redirect_uri");

  const willRedirect = !!location?.state?.postLoginRedirect || !!redirectUri;

  const updateView = (newView, e) => {
    if (e) e.preventDefault();
    // Account linking requires logging in to an existing account.
    if (isLinking && (newView === "terms" || newView === "create")) return;
    setView(newView);
  };

  useEffect(() => {
    if (authentication.authenticated) {
      // A logged-in user must still re-authenticate to link; a successful
      // login replaces the session.
      if (showLogout && !isLinking && view !== "logout") {
        return setView("logout");
      }
      /* This condition isn't quite right. Figure out what it's trying to do. */
      if (willRedirect && view !== "create-update") {
        if (hideOverlay) hideOverlay();
      }
    }
  }, [
    authentication.authenticated,
    hideOverlay,
    view,
    showLogout,
    willRedirect,
    isLinking
  ]);

  /* eslint-disable no-nested-ternary */
  const viewProps = {
    handleViewChange: updateView,
    redirectToHomeOnSignup: defaultView === "terms",
    willRedirect,
    hideOverlay,
    mode:
      view === "update"
        ? "existing"
        : view === "create-update"
        ? "new"
        : undefined
  };

  const View = VIEW_COMPONENT[view];
  return <View {...viewProps} />;
}

SignInUpInterface.displayName = "Global.SignInUp.Interface";

SignInUpInterface.propTypes = {
  defaultView: PropTypes.oneOf(Object.keys(VIEW_COMPONENT)),
  showLogout: PropTypes.bool,
  hideOverlay: PropTypes.func
};
