import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';
import { Header } from '../../components/frontend';

class Frontend extends Component {

  static propTypes = {
    children: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
      <BodyClass className={'frontend'}>
        <div>
          <DocumentMeta {...config.app}/>
          <Header />
          <section className={'frontend-container'}>
            {this.props.children}
          </section>
        </div>
      </BodyClass>
    );
  }
}

export default connect(
  // mapStateToProps
)(Frontend);

