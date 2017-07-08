import React, { Children, PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import isString from "lodash/isString";

class RequireRole extends PureComponent {
  static mapStateToProps(state) {
    return {
      authentication: state.authentication
    };
  }

  static propTypes = {
    requiredRole: PropTypes.string.isRequired,
    roleMatchBehavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    redirect: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };

  static defaultProps = {
    roleMatchBehavior: "show"
  };

  constructor() {
    super();
    this.state = { redirect: false };
  }

  componentWillReceiveProps(nextProps) {
    if (this.canRedirect(nextProps) && !this.roleMatch(nextProps)) {
      return this.setState({ redirect: true });
    }
  }

  isAuthenticated(props) {
    return props.authentication.authenticated;
  }

  canRedirect(props) {
    return isString(props.redirect);
  }

  user(props) {
    return props.authentication.currentUser;
  }

  redirect(props) {
    return <Redirect to={props.redirect} />;
  }

  roleMatch(props) {
    if (props.requiredRole === "none" && !this.isAuthenticated(props))
      return true;
    if (!this.isAuthenticated(props)) return false;
    if (props.requiredRole === "any" && this.isAuthenticated(props))
      return true;
    return props.requiredRole === this.user(props).attributes.role;
  }

  behavior(props) {
    return props.roleMatchBehavior;
  }

  renderHide(props) {
    if (!this.roleMatch(props)) return Children.only(this.props.children);
    return null;
  }

  renderShow(props) {
    if (this.roleMatch(props)) return Children.only(this.props.children);
    return null;
  }

  render() {
    if (this.state.redirect) return this.redirect(this.props);
    if (!this.props.children) return false;
    const behavior = this.behavior(this.props);
    if (behavior === "hide") return this.renderHide(this.props);
    if (behavior === "show") return this.renderShow(this.props);
    return null;
  }
}

export { RequireRole as RequireRoleWrapper }; // unconnected for testing
export default connect(RequireRole.mapStateToProps)(RequireRole);
