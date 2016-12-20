import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

class SettingsGeneralContainer extends PureComponent {

  render() {
    return (<div>settings general</div>);
  }

}

export default connect(
  SettingsGeneralContainer.mapStateToProps
)(SettingsGeneralContainer);

