import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { resourcesAPI } from 'api';

export default class ResourceDetailMetadata extends PureComponent {

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
          debug={true}
          className="form-secondary"
        >
          <Form.TextInput
            focusOnMount
            label="A Resource Metadata Field"
            name="attributes[metadata][field]"
            placeholder="A Resource Metadata Field"
          />
          <Form.Save
            text="Save Metadata"
          />
        </FormContainer.Form>
      </section>
    );
  }
}
