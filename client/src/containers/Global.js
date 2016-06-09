import React, { Children, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentMeta from 'react-document-meta';
import { SignInUp, LoadingBar } from '../components/shared';
import config from '../config';
import get from 'lodash/get';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { visibilityHide } from '../actions/shared/ui/visibility';

class GlobalContainer extends Component {

  static mapStateToProps(state) {
    return {
      authentication: state.authentication,
      visibility: state.ui.visibility,
      loading: state.ui.loading.active,
      notifications: state.notifications,
      routing: state.routing
    };
  }

  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    visibility: PropTypes.object,
    authentication: PropTypes.object,
    children: PropTypes.array
  };

  componentWillReceiveProps(nextProps) {
    // We reload the page on logout, to ensure that all data is cleared from the store.
    if (nextProps.authentication.authenticated === false &&
      this.props.authentication.authenticated === true) {
      location.reload();
    }
  }

  render() {
    const hideSignInUpOverlay = bindActionCreators(
      () => visibilityHide('signInUpOverlay'), this.props.dispatch
    );

    return (
      <div className="global-container">
        <DocumentMeta {...config.app}/>
        <LoadingBar loading={this.props.loading} />
        <ReactCSSTransitionGroup
          transitionName={'overlay-login'}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          { this.props.visibility.signInUpOverlay ?
            <SignInUp.Overlay
              key="signInUpOverlay"
              hideSignInUpOverlay={hideSignInUpOverlay}
              authentication={this.props.authentication}
              dispatch={this.props.dispatch}
              hash={get(this, 'props.routing.locationBeforeTransitions.hash')}
            />
            : null}
        </ReactCSSTransitionGroup>
        {this.props.children}

      </div>
    );
  }

}

const Global = connect(
  GlobalContainer.mapStateToProps
)(GlobalContainer);

export default Global;
