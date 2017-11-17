import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { collectionsAPI } from "api";
import { connect } from "react-redux";

export class CollectionGeneralContainer extends PureComponent {
  static displayName = "Collection.General";

  static propTypes = {
    collection: PropTypes.object,
    params: PropTypes.object
  };

  render() {
    const collection = this.props.collection;
    if (!collection) return null;

    return (
      <section>
        <FormContainer.Form
          model={collection}
          name="backend-collection-update"
          update={collectionsAPI.update}
          create={model =>
            collectionsAPI.create(this.props.params.projectId, model)}
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
          <Form.Upload
            layout="landscape"
            accepts="images"
            label="Cover Image"
            readFrom="attributes[thumbnailStyles][mediumLandscape]"
            name="attributes[thumbnail]"
            remove="attributes[removeThumbnail]"
          />
          <Form.Save text="Save Collection" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(CollectionGeneralContainer.mapStateToProps)(
  CollectionGeneralContainer
);
