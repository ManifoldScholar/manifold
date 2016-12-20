import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

class SettingsWrapperContainer extends PureComponent {

  render() {
    return (<div>settings wrapper</div>);
  }

}

export default connect(
  SettingsWrapperContainer.mapStateToProps
)(SettingsWrapperContainer);

