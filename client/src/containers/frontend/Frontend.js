import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass, LoginOverlay, LoadingBar } from '../../components/shared';
import { Header, Footer } from '../../components/frontend';
import { startLogout } from '../../actions/shared/authentication';
import { visibilityToggle, visibilityHide, visibilityShow, panelToggle, panelHide }
  from '../../actions/shared/ui/visibility';
import { whoami } from '../../actions/shared/authentication';

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    visibility: state.ui.visibility,
    loading: state.ui.loading.active
  };
}

@connect(mapStateToProps)
export default class Frontend extends Component {

  static propTypes = {
    routeDataLoaded: PropTypes.bool,
    children: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    loading: PropTypes.bool,
    history: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.setMinHeight();
    dispatch(whoami());
  }

  componentWillReceiveProps(nextProps) {
    // We reload the page on logout, to ensure that all data is cleared from the store.
    if (nextProps.authentication.authenticated === false &&
      this.props.authentication.authenticated === true) {
      location.reload();
    }
    this.setMinHeight();
  }

  setMinHeight() {
    const windowHeight = window.innerHeight;
    this.refs.mainContainer.style.minHeight = `${windowHeight}px`;
    console.log(this.refs.mainContainer);
  }

  render() {
    const hideLoginOverlay = bindActionCreators(
      () => visibilityHide('loginOverlay'), this.props.dispatch
    );
    return (
      <BodyClass className={'browse'}>
        <div>
          <DocumentMeta {...config.app}/>
          <LoadingBar loading={this.props.loading} />
          <Header
            visibility={this.props.visibility }
            location={this.props.location}
            authenticated={this.props.authentication.authToken === null ? false : true}
            visibilityToggle={bindActionCreators((el) => visibilityToggle(el), this.props.dispatch)}
            visibilityHide={bindActionCreators((el) => visibilityHide(el), this.props.dispatch)}
            visibilityShow={bindActionCreators((el) => visibilityShow(el), this.props.dispatch)}
            panelToggle={bindActionCreators((el) => panelToggle(el), this.props.dispatch)}
            panelHide={bindActionCreators((el) => panelHide(el), this.props.dispatch)}
            startLogout={bindActionCreators(() => startLogout(), this.props.dispatch)}
          />
          {/* Add hideOverlay={false} to show overlay */}
          <LoginOverlay
            visible={this.props.visibility.loginOverlay}
            hideLoginOverlay={hideLoginOverlay}
          />
          <main ref="mainContainer">
            {this.props.children}
          </main>
          <Footer />
        </div>
      </BodyClass>
    );
  }
}
