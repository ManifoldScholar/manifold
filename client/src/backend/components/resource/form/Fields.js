import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import KindPicker from "./KindPicker";
import KindAttributes from "./KindAttributes";
import { tagsAPI } from "api";

export default function ResourcePropertiesFields({ resource }) {
  const { t } = useTranslation();

  return (
    <>
      <Form.FieldGroup label={t("projects.forms.properties.header")}>
        <KindPicker name="attributes[kind]" includeButtons />
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
        <KindAttributes wide />
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
          value={!!resource.attributes.sortOrder}
          placeholder={t("resources.properties.sort_order_placeholder")}
          instructions={t("resources.properties.sort_order_instructions")}
        />
      </Form.FieldGroup>
    </>
  );
}
