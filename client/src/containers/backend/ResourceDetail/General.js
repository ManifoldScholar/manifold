import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import update from 'immutability-helper';
import set from 'lodash/set';
import { resourcesAPI } from 'api';

export default class ResourceDetailGeneralContainer extends PureComponent {

  static displayName = "ResourceDetail.General";
  static activeNavItem = "general";

  static propTypes = {
    route: PropTypes.object,
    text: PropTypes.object,
    dispatch: PropTypes.func,
    editSession: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.resource}
          name="backend-text-general"
          update={resourcesAPI.update}
          create={resourcesAPI.create}
          className="form-secondary"
        >
          <Form.TextInput
            label="Title"
            name="attributes[title]"
            placeholder="Enter Text Title"
          />
          <Form.Save text="Save Resource" />
        </FormContainer.Form>
      </section>
    );
  }
}
