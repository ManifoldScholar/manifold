import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { resourceCollectionsAPI } from "api";
import { connect } from "react-redux";

export class ResourceCollectionPropertiesContainer extends PureComponent {
  static displayName = "resourceCollection.Properties";

  static propTypes = {
    resourceCollection: PropTypes.object,
    params: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    const { resourceCollection, t } = this.props;
    if (!resourceCollection) return null;

    const formatData = data => {
      const { thumbnailAltText, thumbnail, ...rest } = data?.attributes ?? {};

      const finalThumbnailData =
        typeof thumbnailAltText === "string"
          ? { ...thumbnail, altText: thumbnailAltText }
          : thumbnail;

      return {
        ...data,
        attributes: { thumbnail: finalThumbnailData, ...rest }
      };
    };

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
          formatData={formatData}
        >
          <Form.TextInput
            label={t("resource_collections.forms.title_label")}
            name="attributes[title]"
            placeholder={t("resource_collections.forms.title_placeholder")}
            {...this.props}
          />
          <Form.TextArea
            label={t("resource_collections.forms.descript_label")}
            name="attributes[description]"
            placeholder={t("resource_collections.forms.descript_placeholder")}
            {...this.props}
          />
          <Form.TextInput
            wide
            label={t("resource_collections.forms.slug_label")}
            name="attributes[pendingSlug]"
            placeholder={t("resource_collections.forms.sluslug_placeholder")}
          />
          <Form.Upload
            layout="landscape"
            accepts="images"
            label={t("resource_collections.forms.image_label")}
            readFrom="attributes[thumbnailStyles][small]"
            name="attributes[thumbnail]"
            remove="attributes[removeThumbnail]"
            altTextName="attributes[thumbnailAltText]"
            altTextLabel={t("hero.cover_image_alt_label")}
          />
          <Form.Save text={t("resource_collections.forms.save")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(
  connect(ResourceCollectionPropertiesContainer.mapStateToProps)(
    ResourceCollectionPropertiesContainer
  )
);
