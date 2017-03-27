import React, { PureComponent, PropTypes } from 'react';
import { Resource, Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { Resource as FrontendResource } from 'components/frontend';
import { resourcesAPI } from 'api';
import { notificationActions } from 'actions';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';

class ResourceDetailGeneralContainer extends PureComponent {

  static displayName = "ResourceDetail.General";
  static activeNavItem = "general";

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = this.initialState();
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  initialState() {
    return {
      newKind: null,
      changeKind: false
    };
  }

  handleSuccess() {
    this.setState(this.initialState);
  }

  render() {
    const resource = this.props.resource.attributes;
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={(model) => resourcesAPI.create(this.props.params.projectId, model) }
          onSuccess={this.handleSuccess}
          className="form-secondary"
        >
          <Resource.Form.KindPicker name="attributes[kind]" />
          <Form.TextInput
            label="Title"
            name="attributes[title]"
            placeholder="Enter a title"
            {...this.props}
          />
          <Form.TextArea
            label="Description"
            name="attributes[description]"
            placeholder="Enter a description"
            {...this.props}
          />
          <Form.TextInput
            label="Caption"
            name="attributes[caption]"
            placeholder="Enter a short description"
            {...this.props}
          />
          {resource.downloadableKind ?
            <Form.Switch
              label="Allow download?"
              name="attributes[allowDownload]"
            />
            : null
          }
          <Resource.Form.KindAttributes />
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
