import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass, LoginOverlay } from '../../components/shared';
import { Header, Footer } from '../../components/frontend';
import { startLogout } from '../../actions/shared/authentication';
import { visibilityToggle, visibilityHide, visibilityShow, panelToggle, panelHide } from '../../actions/shared/ui/visibility';
import { whoami } from '../../actions/shared/authentication';

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    location: state.router.location,
    visibility: state.ui.visibility
  };
}

@connect(mapStateToProps)
export default class Frontend extends Component {

  static propTypes = {
    children: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    location: PropTypes.object,
    visibility: PropTypes.object,
    history: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(whoami());
  };

  componentWillReceiveProps = (nextProps) => {
    // We reload the page on logout, to ensure that all data is cleared from the store.
    if (nextProps.authentication.authenticated === false && this.props.authentication.authenticated === true) {
      location.reload();
    }
  }

  render() {
    return (
      <BodyClass className={'browse'}>
        <div onClick={this.handleClick}>
          <DocumentMeta {...config.app}/>
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
              hideLoginOverlay={bindActionCreators(() => visibilityHide('loginOverlay'), this.props.dispatch)}
          />
          <main>
            {this.props.children}
          </main>
          <Footer />
        </div>
      </BodyClass>
    );
  }
}
