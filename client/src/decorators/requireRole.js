import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import hoistStatics from 'hoist-non-react-statics';

export default function requireRole(roleIgnored, behaviorIgnored) {

  return function wrapWithRequireRole(WrappedComponent) {

    class RequiredRoleComponent extends Component {

      static propTypes = {
        authentication: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
      };

      componentWillMount() {
        this.checkAuth();
      }

      componentWillReceiveProps() {
        this.checkAuth();
      }

      checkAuth() {
        if (this.props.authentication.authenticated !== true) {
          const redirectAfterLogin = this.props.location.pathname;
          this.props.dispatch(pushState(null, `/browse/login?next=${redirectAfterLogin}`));
        }
      }

      render() {
        return (
          <div>
            {this.props.authentication.authenticated === true
              ? <WrappedComponent {...this.props}/>
              : null
            }
          </div>
        );
      }
    }

    function mapStateToProps(state) {
      return {
        authentication: state.authentication
      };
    }

    const RequiredRole = connect(
      mapStateToProps
    )(RequiredRoleComponent);

    return hoistStatics(RequiredRole, WrappedComponent);
  };
}
