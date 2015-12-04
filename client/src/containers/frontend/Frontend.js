import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';
import { LoginOverlay } from './';
import { Header, Footer } from '../../components/frontend';
import { whoami } from '../../actions/shared/authentication';

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    location: state.router.location
  };
}

@connect(mapStateToProps)
export default class Frontend extends Component {

  static propTypes = {
    children: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object
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
          <Header location={this.props.location} authenticated={this.props.authentication.authToken === null ? false : true} />
          {/* Add hideOverlay={false} to show overlay */}
          <LoginOverlay />
          <main>
            {this.props.children}
          </main>
          <Footer />
        </div>
      </BodyClass>
    );
  }
}
