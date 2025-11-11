import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { resourceCollectionsAPI } from "api";

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

function ResourceCollectionPropertiesContainer() {
  const { t } = useTranslation();
  const { resourceCollection } = useOutletContext();

  if (!resourceCollection) return null;

  return (
    <section>
      <FormContainer.Form
        model={resourceCollection}
        name="backend-collection-update"
        update={resourceCollectionsAPI.update}
        create={resourceCollectionsAPI.create}
        className="form-secondary"
        formatData={formatData}
      >
        <Form.TextInput
          label={t("resource_collections.forms.title_label")}
          name="attributes[title]"
          placeholder={t("resource_collections.forms.title_placeholder")}
        />
        <Form.TextArea
          label={t("resource_collections.forms.descript_label")}
          name="attributes[description]"
          placeholder={t("resource_collections.forms.descript_placeholder")}
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

ResourceCollectionPropertiesContainer.displayName =
  "ResourceCollection.Properties";

export default ResourceCollectionPropertiesContainer;
