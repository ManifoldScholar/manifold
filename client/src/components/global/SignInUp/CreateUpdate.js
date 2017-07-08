import React, { Component } from "react";
import PropTypes from "prop-types";
import { SignInUp } from "components/global";

export default class CreateUpdate extends Component {
  render() {
    return <SignInUp.UpdateForm mode="new" {...this.props} />;
  }
}
