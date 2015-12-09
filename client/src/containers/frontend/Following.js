import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Following extends Component {

  static propTypes = {};

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    return (
        <div>
          {"This is a stub area for the following page content area"}
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Following);
