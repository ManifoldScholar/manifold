import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isPlainObject from "lodash/isPlainObject";
import { withRouter } from "react-router-dom";
import { notificationActions } from "actions";
import Authorization from "helpers/authorization";
import get from "lodash/get";

export class AuthorizeComponent extends PureComponent {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication
    };
  };

  static propTypes = {
    entity: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.array
    ]),
    ability: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    kind: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    successBehavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    failureRedirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    failureNotification: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        heading: PropTypes.string,
        body: PropTypes.string,
        level: PropTypes.number
      })
    ]),
    children: PropTypes.node,
    authentication: PropTypes.object
  };

  static defaultProps = {
    successBehavior: "show",
    failureRedirect: null,
    failureNotification: null
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  get isAuthenticated() {
    return get(this.props, "authentication.authenticated");
  }

  redirectPath(props) {
    if (props.failureRedirect === true) {
      const pathKey = this.props.location.pathname.split("/")?.[1];
      const availableRedirects = [
        "projects/all",
        "backend/dashboard",
        "journals/all",
        "groups"
      ];
      return pathKey
        ? `/${availableRedirects.find(r => r.startsWith(pathKey))}`
        : "/";
    }

    if (typeof props.failureRedirect === "string") return props.failureRedirect;

    return null;
  }

  doNotify(failureNotification) {
    let error = {
      heading: "Access Denied.",
      body:
        "Please login to proceed. After logging in, you will be automatically redirected.",
      level: 2,
      scope: "authentication"
    };
    if (isPlainObject(failureNotification)) {
      error = Object.assign(error, failureNotification);
    }
    this.props.dispatch(notificationActions.addNotification(error));
  }

  redirectAndNotify({
    redirectPath,
    showLoginOverlay,
    redirectUri,
    notificationContent
  }) {
    if (showLoginOverlay) this.doNotify(notificationContent);

    this.props.history.push({
      pathname: redirectPath,
      // eslint-disable-next-line no-nested-ternary
      search: this.isAuthenticated
        ? "?notification=authorizationError"
        : !showLoginOverlay
        ? `?redirect_uri=${redirectUri}`
        : undefined,
      state: {
        showLogin: showLoginOverlay,
        notificationBody: notificationContent?.body
      }
    });
  }

  handleRedirect(props) {
    const redirectPath = this.redirectPath(props);
    const showLoginOverlay = !this.isAuthenticated && redirectPath !== "/login";
    const redirectUri = `${this.props.location.pathname}${this.props.location.search}`;

    if (redirectPath)
      return this.redirectAndNotify({
        redirectPath,
        showLoginOverlay,
        redirectUri,
        notificationContent: props.failureNotification
      });
  }

  successBehavior(props) {
    return props.successBehavior;
  }

  renderHide(props) {
    if (this.authorization.authorize(props)) return null;
    return <>{this.props.children}</>;
  }

  renderShow(props) {
    if (!this.authorization.authorize(props)) return null;
    return <>{this.props.children}</>;
  }

  render() {
    const isAuthorized = this.authorization.authorize(this.props);
    if (!isAuthorized && this.props.failureRedirect)
      return this.handleRedirect(this.props);

    if (!this.props.children) return null;

    const successBehavior = this.successBehavior(this.props);
    if (successBehavior === "hide") return this.renderHide(this.props);
    if (successBehavior === "show") return this.renderShow(this.props);

    return null;
  }
}

export default connect(AuthorizeComponent.mapStateToProps)(
  withRouter(AuthorizeComponent)
);
