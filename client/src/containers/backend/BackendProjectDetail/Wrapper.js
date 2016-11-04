import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export default class BackendWrapper extends Component {
  // static mapStateToProps(state) {
  //   return {
  //     project: select(requests.showProjectDetail, state.entityStore)
  //   };
  // }

  static propTypes = {};

  render() {
    return (
      <div>
        {'hi!'}
      </div>
    );
  }
}
