import React, { Children, PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import isString from "lodash/isString";

class RequireKind extends PureComponent {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication
    };
  };

  static propTypes = {
    requiredKind: PropTypes.string.isRequired,
    kindMatchBehavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    redirect: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };

  static defaultProps = {
    kindMatchBehavior: "show"
  };

  constructor() {
    super();
    this.state = { redirect: false };
  }

  componentWillReceiveProps(nextProps) {
    if (this.canRedirect(nextProps) && !this.kindMatch(nextProps)) {
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

  kindMatch(props) {
    if (props.requiredKind === "none") return true;
    if (
      props.requiredKind === "unauthenticated" &&
      !this.isAuthenticated(props)
    )
      return true;
    if (!this.isAuthenticated(props)) return false;
    if (props.requiredKind === "any" && this.isAuthenticated(props))
      return true;
    return props.requiredKind === this.user(props).attributes.kind;
  }

  behavior(props) {
    return props.kindMatchBehavior;
  }

  renderHide(props) {
    if (!this.kindMatch(props)) return Children.only(this.props.children);
    return null;
  }

  renderShow(props) {
    if (this.kindMatch(props)) return Children.only(this.props.children);
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

export { RequireKind as RequireKindWrapper }; // unconnected for testing
export default connect(RequireKind.mapStateToProps)(RequireKind);
