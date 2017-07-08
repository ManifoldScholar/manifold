import React, { Component } from "react";
import PropTypes from "prop-types";
import { textsAPI } from "api";
import { Form as FormContainer } from "containers/backend";
import { connect } from "react-redux";

export class TextDetailCollaborators extends Component {
  static displayName = "TextDetail.Collaborators";

  static propTypes = {
    text: PropTypes.object
  };

  render() {
    const text = this.props.text;

    return <FormContainer.Collaborators entity={text} api={textsAPI} />;
  }
}

export default connect(TextDetailCollaborators.mapStateToProps)(
  TextDetailCollaborators
);
