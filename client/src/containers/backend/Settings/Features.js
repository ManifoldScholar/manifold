import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
import Placeholder from './Placeholder';

class SettingsFeaturesContainer extends PureComponent {

  static activeNavItem = "features";

  render() {
    return (
      <section>
        <Placeholder label="features" />
      </section>
    );
  }

}

export default connect(
  SettingsFeaturesContainer.mapStateToProps
)(SettingsFeaturesContainer);

