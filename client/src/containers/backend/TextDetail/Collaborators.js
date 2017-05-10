import React, { Component, PropTypes } from 'react';
import { Form, Text } from 'components/backend';
import { textsAPI, requests } from 'api';
import { Form as FormContainer } from 'containers/backend';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import get from 'lodash/get';

const { request, flush } = entityStoreActions;

class TextDetailCollaborators extends Component {

  static displayName = "TextDetail.Collaborators";
  static activeNavItem = "collaborators";

  static propTypes = {
    text: PropTypes.object
  };

  render() {
    const text = this.props.text;

    return (
      <FormContainer.Collaborators entity={text} api={textsAPI} />
    );
  }
}

export default connect(
  TextDetailCollaborators.mapStateToProps
)(TextDetailCollaborators);

