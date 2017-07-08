import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Metadata } from "components/backend";
import { textsAPI } from "api";

export default class TextDetailMetadata extends PureComponent {
  static displayName = "TextDetail.Metadata";

  static propTypes = {
    text: PropTypes.object
  };

  render() {
    return (
      <Metadata.Form
        model={this.props.text}
        name="backend-project-general"
        update={textsAPI.update}
        create={textsAPI.create}
        className="form-secondary"
      />
    );
  }
}
