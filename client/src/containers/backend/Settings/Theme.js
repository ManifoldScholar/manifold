import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
import Placeholder from './Placeholder';

class SettingsThemeContainer extends PureComponent {

  static activeNavItem = "theme";

  render() {
    return (
      <section>
        <Placeholder label="theme" />
      </section>
    );
  }

}

export default connect(
  SettingsThemeContainer.mapStateToProps
)(SettingsThemeContainer);

