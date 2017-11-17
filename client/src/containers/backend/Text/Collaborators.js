import React, { Component } from "react";
import PropTypes from "prop-types";
import { textsAPI } from "api";
import { Form as FormContainer } from "containers/backend";
import { connect } from "react-redux";

export class TextCollaboratorsContainer extends Component {
  static displayName = "Text.Collaborators";

  static propTypes = {
    text: PropTypes.object
  };

  render() {
    const text = this.props.text;

    return <FormContainer.Collaborators entity={text} api={textsAPI} />;
  }
}

export default connect(TextCollaboratorsContainer.mapStateToProps)(
  TextCollaboratorsContainer
);
