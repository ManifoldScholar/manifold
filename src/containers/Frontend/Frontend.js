import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';

class Frontend extends Component {

  static propTypes = {
    children: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <DocumentMeta {...config.app}/>
        This is the frontend

        <div>
        Children:
        {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
)(Frontend);

