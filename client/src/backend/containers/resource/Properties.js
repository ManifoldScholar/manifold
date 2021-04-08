import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import Resource from "backend/components/resource";
import FormContainer from "global/containers/form";
import { resourcesAPI, tagsAPI } from "api";
import { connect } from "react-redux";

export class ResourcePropertiesContainer extends PureComponent {
  static displayName = "Resource.Properties";

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
            instructions="This field accepts Markdown"
          />
          <Form.TextInput
            label="Sort Title"
            name="attributes[pendingSortTitle]"
            placeholder="Enter sort title"
            instructions="This field is only used to sort resources alphabetically in lists. If blank, sorting is based on resource title."
            disabled
          />
          <Form.TextInput
            label="Fingerprint"
            name="attributes[fingerprint]"
            placeholder="Enter fingerprint"
            instructions="The fingerprint is used to indentify resources during bulk resource imports."
            disabled
          />
          <Form.TextInput
            label="Slug"
            name="attributes[pendingSlug]"
            placeholder="Enter URL Slug"
          />
          <Form.Picker
            label="Tags"
            listStyle="well"
            listRowComponent="StringRow"
            name="attributes[tagList]"
            placeholder="Enter Tags"
            options={tagsAPI.index}
            optionToLabel={tag => tag.attributes.name}
            optionToValue={tag => tag.attributes.name}
            allowNew
          />
          <Form.TextArea
            label="Description"
            name="attributes[description]"
            placeholder="Enter a description"
          />
          <Form.TextArea
            label="Caption"
            name="attributes[caption]"
            placeholder="Enter a short description"
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

export default connect(ResourcePropertiesContainer.mapStateToProps)(
  ResourcePropertiesContainer
);
