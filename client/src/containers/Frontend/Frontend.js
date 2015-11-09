import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';

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
          {this.props.children}
        </div>
      </BodyClass>
    );
  }
}

export default connect(
  // mapStateToProps
)(Frontend);

