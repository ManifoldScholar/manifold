import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { Resource } from 'components/backend';
import { resourcesAPI } from 'api';
import { notificationActions } from 'actions';
import { connect } from 'react-redux';

class ResourceDetailGeneralContainer extends PureComponent {

  static displayName = "ResourceDetail.General";
  static activeNavItem = "general";

  static propTypes = {
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
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
          className="form-secondary"
        >
          <Form.TextInput
            focusOnMount
            label="Title"
            name="attributes[title]"
            placeholder="Enter a title"
            {...this.props}
          />
          <Form.TextArea
            focusOnMount
            label="Description"
            name="attributes[description]"
            placeholder="Enter a description"
            {...this.props}
          />
          <Form.TextInput
            focusOnMount
            label="Caption"
            name="attributes[caption]"
            placeholder="Enter a short description"
            {...this.props}
          />
          <Form.Save
            text="Save Resource"
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(
  ResourceDetailGeneralContainer.mapStateToProps
)(ResourceDetailGeneralContainer);
