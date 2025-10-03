import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import { Redirect, withRouter } from "react-router-dom";
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
    failureRedirect: PropTypes.string,
    failureNotification: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        heading: PropTypes.string,
        body: PropTypes.string,
        level: PropTypes.number
      })
    ]),
    failureRedirectAndNotify: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        heading: PropTypes.string,
        body: PropTypes.string,
        detai: PropTypes.string
      })
    ]),
    children: PropTypes.node,
    authentication: PropTypes.object
  };

  static defaultProps = {
    successBehavior: "show",
    failureRedirect: null,
    failureNotification: null,
    failureFatalError: null
  };

  constructor(props) {
    super(props);
    this.state = { redirect: false };
    this.authorization = new Authorization();
  }

  componentDidMount() {
    this.maybeRedirectAndNotify(this.props);
    this.maybeNotify(this.props);
    if (this.maybeRedirect(this.props)) this.setState({ redirect: true });
  }

  componentDidUpdate() {
    if (this.maybeRedirect(this.props)) this.setState({ redirect: true });
  }

  get isAuthenticated() {
    return get(this.props, "authentication.authenticated");
  }

  maybeRedirect(props) {
    if (!isString(props.failureRedirect)) return false;
    return !this.authorization.authorize(props);
  }

  successBehavior(props) {
    return props.successBehavior;
  }

  maybeRedirectAndNotify(props) {
    if (
      !!props.failureRedirectAndNotify &&
      !this.authorization.authorize(props)
    ) {
      const pathKey = this.props.location.pathname.split("/")?.[1];
      const availableRedirects = [
        "projects/all",
        "backend/dashboard",
        "journals/all",
        "groups"
      ];
      const redirect = pathKey
        ? `/${availableRedirects.find(r => r.startsWith(pathKey))}`
        : "/";

      return this.props.history.push({
        pathname: redirect,
        search: "?notification=authorizationError",
        state: {
          notificationBody:
            props.failureRedirectAndNotify.detail ??
            props.failureRedirectAndNotify.body
        }
      });
    }
  }

  maybeNotify(props) {
    if (!!props.failureNotification && !this.authorization.authorize(props)) {
      let error = {
        heading: "Access Denied.",
        body: "Please login to proceed.",
        level: 2,
        scope: "authentication"
      };
      if (isPlainObject(props.failureNotification)) {
        error = Object.assign(error, props.failureNotification);
      }
      props.dispatch(notificationActions.addNotification(error));
    }
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
    if (this.state.redirect) {
      const to = {
        pathname: this.props.failureRedirect,
        state: {
          showLogin:
            !this.isAuthenticated && this.props.failureRedirect !== "/login",
          postLoginRedirect: `${this.props.location.pathname}${this.props.location.search}`
        }
      };
      return <Redirect to={to} />;
    }
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
