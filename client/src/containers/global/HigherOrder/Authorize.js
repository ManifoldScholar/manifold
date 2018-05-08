import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import { Redirect } from "react-router-dom";
import { notificationActions } from "actions";
import Authorization from "helpers/authorization";

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
      PropTypes.object
    ]),
    failureFatalError: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
        title: "Access Denied.",
        detail: "You do not have sufficient permissions to perform this action."
      };
      if (isPlainObject(props.failureFatalError)) {
        error = Object.assign(error, props.failureFatalError);
      }
      props.dispatch(notificationActions.fatalError(error));
    }
  }

  maybeNotify(props) {
    if (!!props.failureNotification && !this.authorization.authorize(props)) {
      let error = {
        heading: "Access Denied.",
        body: "You do not have sufficient permissions to perform this action.",
        level: 2
      };
      if (isPlainObject(props.failureNotification)) {
        error = Object.assign(error, props.failureNotification);
      }
      props.dispatch(notificationActions.addNotification(error));
    }
  }

  renderHide(props) {
    if (this.authorization.authorize(props)) return null;
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  renderShow(props) {
    if (!this.authorization.authorize(props)) return null;
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  render() {
    if (this.state.redirect)
      return <Redirect to={this.props.failureRedirect} />;
    if (!this.props.children) return false;
    const successBehavior = this.successBehavior(this.props);
    if (successBehavior === "hide") return this.renderHide(this.props);
    if (successBehavior === "show") return this.renderShow(this.props);
    return null;
  }
}

export default connect(AuthorizeComponent.mapStateToProps)(AuthorizeComponent);
