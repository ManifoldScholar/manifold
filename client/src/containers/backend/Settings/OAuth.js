import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
import Placeholder from './Placeholder';

class SettingsOAuthContainer extends PureComponent {

  static activeNavItem = "oauth";

  render() {
    return (
      <section>
        <Placeholder label="OAuth" />
      </section>
    );
  }

}

export default connect(
  SettingsOAuthContainer.mapStateToProps
)(SettingsOAuthContainer);

