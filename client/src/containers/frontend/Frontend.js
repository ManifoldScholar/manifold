import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HigherOrder } from 'components/global';
import { Header, Footer } from 'components/frontend';
import { authActions, uiVisibilityActions, notificationActions } from 'actions';

const { startLogout } = authActions;
const {
  visibilityToggle, visibilityHide, visibilityShow, panelToggle, panelHide
} = uiVisibilityActions;
const {
  addNotification, removeNotification, removeAllNotifications
} = notificationActions;

class FrontendContainer extends Component {

  static propTypes = {
    routeDataLoaded: PropTypes.bool,
    children: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    loading: PropTypes.bool,
    notifications: PropTypes.object,
    history: PropTypes.object.isRequired,
    renderDevTools: PropTypes.bool
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.setMinHeight();
  }

  setMinHeight() {
    const mainHeight = this.refs.mainContainer.offsetHeight;
    const offsetHeight = this.refs.mainContainer.parentNode.offsetHeight - mainHeight;
    this.refs.mainContainer.style.minHeight = `calc(100vh - ${offsetHeight}px)`;
  }

  headerMethods() {
    return {
      visibilityToggle: bindActionCreators((el) => visibilityToggle(el), this.props.dispatch),
      visibilityHide: bindActionCreators((el) => visibilityHide(el), this.props.dispatch),
      visibilityShow: bindActionCreators((el) => visibilityShow(el), this.props.dispatch),
      panelToggle: bindActionCreators((el) => panelToggle(el), this.props.dispatch),
      addNotification: bindActionCreators((el) => addNotification(el), this.props.dispatch),
      removeNotification: bindActionCreators((el) => removeNotification(el), this.props.dispatch),
      removeAllNotifications: bindActionCreators(() =>
          removeAllNotifications(), this.props.dispatch),
      panelHide: bindActionCreators((el) => panelHide(el), this.props.dispatch),
      startLogout: bindActionCreators(() => startLogout(), this.props.dispatch)
    };
  }

  render() {
    return (
      <HigherOrder.BodyClass className={'browse'}>
        <div>
          <Header
            visibility={this.props.visibility }
            location={this.props.location}
            authentication={this.props.authentication}
            notifications={this.props.notifications}
            {...this.headerMethods()}
          />
          <main ref="mainContainer">
            {this.props.children}
          </main>
          <Footer />
        </div>
      </HigherOrder.BodyClass>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    visibility: state.ui.visibility,
    loading: state.ui.loading.active,
    notifications: state.notifications,
    routing: state.routing
  };
}

const Frontend = connect(
  mapStateToProps
)(FrontendContainer);

export default Frontend;
