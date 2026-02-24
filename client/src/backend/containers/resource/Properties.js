import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Form from "global/components/form";
import Resource from "backend/components/resource";
import FormContainer from "global/containers/form";
import { resourcesAPI, tagsAPI } from "api";

const formatData = (data, resourceKind) => {
  const { attributes, relationships } = data ?? {};
  const {
    sortOrder,
    variantThumbnail: thumbnailData,
    variantThumbnailAltText,
    attachment: attachmentData,
    attachmentAltText,
    ...rest
  } = attributes;

  const isImage = data.attributes.kind
    ? data.attributes.kind === "image"
    : resourceKind === "image";

  if (!isImage)
    return {
      relationships,
      attributes: {
        ...rest,
        ...(attachmentData ? { attachment: attachmentData } : {}),
        ...(thumbnailData
          ? {
              variantThumbnail: {
                ...thumbnailData,
                altText: variantThumbnailAltText
              }
            }
          : {}),
        sortOrder: sortOrder ? 1 : null
      }
    };

  return {
    relationships,
    attributes: {
      ...rest,
      ...(attachmentData || attachmentAltText
        ? {
            attachment: {
              ...attachmentData,
              altText: attachmentAltText
            }
          }
        : {}),
      sortOrder: sortOrder ? 1 : null
    }
  };
};

function ResourcePropertiesContainer() {
  const { t } = useTranslation();
  const { resource } = useOutletContext();

  const { attributes } = resource ?? {};
  const sortOrderBool = !!attributes?.sortOrder;

  return (
    <section>
      <FormContainer.Form
        model={{
          ...resource,
          attributes: { ...resource.attributes, sortOrder: sortOrderBool }
        }}
        name="backend-resource-update"
        update={resourcesAPI.update}
        create={resourcesAPI.create}
        formatData={data => formatData(data, resource.attributes.kind)}
        className="form-secondary"
      >
        <Form.FieldGroup label={t("projects.forms.properties.header")}>
          <Resource.Form.KindPicker name="attributes[kind]" includeButtons />
          <Form.TextInput
            label={t("resources.title_label")}
            name="attributes[title]"
            placeholder={t("resources.title_placeholder")}
            instructions={t("resources.properties.title_instructions")}
            wide
          />
          <Form.TextInput
            label={t("resources.properties.sort_title_label")}
            name="attributes[pendingSortTitle]"
            placeholder={t("resources.properties.sort_title_placeholder")}
            instructions={t("resources.properties.sort_title_instructions")}
            wide
          />
          <Form.TextInput
            label={t("resources.properties.slug_label")}
            name="attributes[pendingSlug]"
            placeholder={t("resources.properties.slug_placeholder")}
            wide
          />
          <Form.TextArea
            label={t("resources.descript_label")}
            name="attributes[description]"
            placeholder={t("resources.descript_placeholder")}
            wide
          />
          <Form.TextArea
            label={t("resources.properties.caption_label")}
            name="attributes[caption]"
            placeholder={t("resources.properties.caption_placeholder")}
            wide
          />
          <Form.TextInput
            label={t("resources.properties.fingerprint_label")}
            name="attributes[fingerprint]"
            placeholder={t("resources.properties.fingerprint_placeholder")}
            instructions={t("resources.properties.fingerprint_instructions")}
            wide
          />
          <Resource.Form.KindAttributes wide />
          {resource.attributes.downloadableKind ? (
            <Form.Switch
              label={t("resources.properties.download_label")}
              name="attributes[allowDownload]"
              wide
            />
          ) : null}
        </Form.FieldGroup>
        {resource.attributes.kind !== "image" && (
          <Form.FieldGroup label={t("resources.properties.thumbnail")}>
            <Form.Upload
              layout="square"
              label={t("resources.properties.thumbnail")}
              accepts="images"
              readFrom="attributes[variantThumbnailStyles][small]"
              name="attributes[variantThumbnail]"
              remove="attributes[removeVariantThumbnail]"
              altTextName={"attributes[variantThumbnailAltText]"}
              altTextLabel={t("resources.properties.thumbnail_alt_label")}
            />
          </Form.FieldGroup>
        )}
        <Form.FieldGroup label={t("projects.forms.properties.taxonomy_header")}>
          <Form.Picker
            label={t("resources.properties.tags_label")}
            listStyle="well"
            listRowComponent="StringRow"
            name="attributes[tagList]"
            placeholder={t("resources.properties.tags_placeholder")}
            options={tagsAPI.index}
            optionToLabel={tag => tag.attributes.name}
            optionToValue={tag => tag.attributes.name}
            allowNew
          />
        </Form.FieldGroup>
        <Form.FieldGroup
          label={t("projects.forms.properties.presentation_header")}
        >
          <Form.Switch
            label={t("resources.properties.sort_order_label")}
            name="attributes[sortOrder]"
            value={sortOrderBool}
            placeholder={t("resources.properties.sort_order_placeholder")}
            instructions={t("resources.properties.sort_order_instructions")}
          />
        </Form.FieldGroup>
        <Form.Save text={t("resources.properties.save")} />
      </FormContainer.Form>
    </section>
  );
}

ResourcePropertiesContainer.displayName = "Resource.Properties";

export default ResourcePropertiesContainer;
