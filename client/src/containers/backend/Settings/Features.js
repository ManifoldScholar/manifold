import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Placeholder from "./Placeholder";

export class SettingsFeaturesContainer extends PureComponent {
  render() {
    return (
      <section>
        <Placeholder label="features" />
      </section>
    );
  }
}

export default connect(SettingsFeaturesContainer.mapStateToProps)(
  SettingsFeaturesContainer
);
