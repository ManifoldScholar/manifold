import { Children, PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import isString from 'lodash/isString';
import { browserHistory } from 'react-router';

class RequireRole extends PureComponent {

  static mapStateToProps(state) {
    return {
      authentication: state.authentication
    };
  }

  static propTypes = {
    requiredRole: PropTypes.string.isRequired,
    redirect: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
  };

  isAuthenticated(props) {
    return props.authentication.authenticated;
  }

  canRedirect(props) {
    return isString(props.redirect);
  }

  canRenderChildren(props) {
    if (!props.children) return false;
    return this.roleMatch(props);
  }

  user(props) {
    return props.authentication.currentUser;
  }

  componentWillReceiveProps(nextProps) {
    if (this.canRedirect(nextProps) && !this.roleMatch(nextProps)) this.redirect(nextProps);
  }

  redirect(props) {
    browserHistory.push(props.redirect);
  }

  roleMatch(props) {
    if (!this.isAuthenticated(props)) return false;
    if (props.requiredRole === "any" && this.isAuthenticated(props)) return true;
    return (props.requiredRole === this.user(props).attributes.role);
  }

  render() {
    if (!this.canRenderChildren(this.props)) return null;
    return Children.only(this.props.children);
  }
}

export default connect(
  RequireRole.mapStateToProps
)(RequireRole);

