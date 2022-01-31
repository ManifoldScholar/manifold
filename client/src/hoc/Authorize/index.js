import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import { Redirect, withRouter } from "react-router-dom";
import { fatalErrorActions, notificationActions } from "actions";
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
    failureFatalError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        heading: PropTypes.string,
        body: PropTypes.string
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
    this.maybeError(this.props);
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
    if (props.failureFatalError) return false;
    return !this.authorization.authorize(props);
  }

  successBehavior(props) {
    return props.successBehavior;
  }

  maybeError(props) {
    if (!!props.failureFatalError && !this.authorization.authorize(props)) {
      let error = {
        heading: "Access Denied.",
        body: "You do not have sufficient permissions to perform this action."
      };
      if (isPlainObject(props.failureFatalError)) {
        error = Object.assign(error, props.failureFatalError);
      }
      props.dispatch(
        fatalErrorActions.setFatalError(
          error,
          fatalErrorActions.types.authorization
        )
      );
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
