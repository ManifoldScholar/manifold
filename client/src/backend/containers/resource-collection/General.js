import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { resourceCollectionsAPI } from "api";
import { connect } from "react-redux";

export class ResourceCollectionGeneralContainer extends PureComponent {
  static displayName = "resourceCollection.General";

  static propTypes = {
    resourceCollection: PropTypes.object,
    params: PropTypes.object
  };

  render() {
    const resourceCollection = this.props.resourceCollection;
    if (!resourceCollection) return null;

    return (
      <section>
        <FormContainer.Form
          model={resourceCollection}
          name="backend-collection-update"
          update={resourceCollectionsAPI.update}
          create={model =>
            resourceCollectionsAPI.create(this.props.params.projectId, model)
          }
          className="form-secondary"
        >
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
            wide
            label="Slug"
            name="attributes[pendingSlug]"
            placeholder="Enter URL Slug"
          />
          <Form.Upload
            layout="landscape"
            accepts="images"
            label="Cover Image"
            readFrom="attributes[thumbnailStyles][small]"
            name="attributes[thumbnail]"
            remove="attributes[removeThumbnail]"
          />
          <Form.Save text="Save Collection" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(ResourceCollectionGeneralContainer.mapStateToProps)(
  ResourceCollectionGeneralContainer
);
