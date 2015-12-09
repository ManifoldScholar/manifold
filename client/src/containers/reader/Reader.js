import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import { BodyClass } from '../../components/shared';

class Reader extends Component {

  static propTypes = {
    children: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
      <BodyClass className="reader">
        <div>
          <DocumentMeta {...config.app}/>
          This is the reader.
        </div>
      </BodyClass>
    );
  }
}

export default connect(
)(Reader);

