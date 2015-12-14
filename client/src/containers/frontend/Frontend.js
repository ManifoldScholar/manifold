import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';
import { Header, Footer, LoginOverlay } from '../../components/frontend';
import { visibilityShow, visibilityHide } from '../../actions/frontend/ui/visibility';
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

  render() {
    return (
      <BodyClass className={'browse'}>
        <div>
          <DocumentMeta {...config.app}/>
          <Header
              showLoginOverlay={bindActionCreators(() => visibilityShow('loginOverlay'), this.props.dispatch)}
              location={this.props.location}
              history={this.props.history}
              authenticated={this.props.authentication.authToken === null ? false : true}
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
