import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";
import Resource from "backend/components/resource";
import FormContainer from "backend/containers/form";
import { resourcesAPI } from "api";
import { connect } from "react-redux";

export class ResourceGeneralContainer extends PureComponent {
  static displayName = "Resource.General";

  static propTypes = {
    resource: PropTypes.object,
    params: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = this.initialState();
  }

  initialState() {
    return {
      newKind: null,
      changeKind: false
    };
  }

  handleSuccess = () => {
    this.setState(this.initialState);
  };

  render() {
    const resource = this.props.resource.attributes;
    return (
      <section>
        <FormContainer.Form
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={model =>
            resourcesAPI.create(this.props.params.projectId, model)
          }
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
          <Form.TextInput
            label="Fingerprint"
            name="attributes[fingerprint]"
            placeholder="Enter fingerprint"
            disabled
          />
          <Form.TextInput
            label="Slug"
            name="attributes[slug]"
            placeholder="Enter slug"
          />
          <Form.TagList
            label="Tags"
            name="attributes[tagList]"
            placeholder="Enter a Tag"
          />
          <Form.TextArea
            label="Description"
            name="attributes[description]"
            placeholder="Enter a description"
            {...this.props}
          />
          <Form.TextArea
            label="Caption"
            name="attributes[caption]"
            placeholder="Enter a short description"
            {...this.props}
          />
          {resource.downloadableKind ? (
            <Form.Switch
              label="Allow download?"
              name="attributes[allowDownload]"
            />
          ) : null}
          <Resource.Form.KindAttributes />
          <Form.Save text="Save Resource" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(ResourceGeneralContainer.mapStateToProps)(
  ResourceGeneralContainer
);
