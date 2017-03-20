import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { resourcesAPI } from 'api';

export default class ResourceDetailMetadataContainer extends PureComponent {

  static displayName = "ResourceDetail.Metadata";
  static activeNavItem = "metadata";

  static propTypes = {
    route: PropTypes.object,
    project: PropTypes.object,
    dispatch: PropTypes.func,
    editSession: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {

    // See https://github.com/ReactTraining/react-router/issues/3753
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.resource}
          name="backend-project-general"
          update={resourcesAPI.update}
          create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
          className="form-secondary"
        >
          <Form.TextInput
            focusOnMount
            label="Tags"
            name="attributes[keywords]"
            placeholder="Enter tags separated by ,"
          />
          <Form.TextInput
            focusOnMount
            label="Copyright Status"
            name="attributes[copyrightStatus]"
            placeholder="Copyright Status"
          />
          <Form.TextInput
            focusOnMount
            label="Copyright Holder"
            name="attributes[copyrightHolder]"
            placeholder="Copyright Holder"
          />
          <Form.TextInput
            focusOnMount
            label="Credit"
            name="attributes[credit]"
            placeholder="Credit"
          />
          <Form.Save
            text="Save Metadata"
          />
        </FormContainer.Form>
      </section>
    );
  }
}
