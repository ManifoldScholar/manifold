import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { textsAPI } from "api";

export default function TextPropertiesContainer({ text }) {
  const { t } = useTranslation();

  const formatData = data => {
    const { coverAltText, cover, ...rest } = data?.attributes ?? {};

    const finalCoverData =
      typeof coverAltText === "string"
        ? { ...cover, altText: coverAltText }
        : cover;

    return {
      ...data,
      attributes: { cover: finalCoverData, ...rest }
    };
  };

  return (
    <section>
      <FormContainer.Form
        model={text}
        name="backend-text-properties"
        update={textsAPI.update}
        create={textsAPI.create}
        className="form-secondary"
        formatData={formatData}
      >
        <Form.FieldGroup label={t("texts.properties.header")}>
          <Form.TextInput
            wide
            label={t("texts.properties.title_label")}
            name="attributes[title]"
            placeholder={t("texts.properties.title_placeholder")}
          />
          <Form.TextInput
            wide
            label={t("texts.properties.subtitle_label")}
            name="attributes[subtitle]"
            placeholder={t("texts.properties.subtitle_placeholder")}
          />
          <Form.DatePicker
            label={t("texts.properties.pub_date_label")}
            name="attributes[publicationDate]"
          />
          <Form.TextInput
            wide
            label={t("texts.properties.slug_label")}
            name="attributes[pendingSlug]"
            placeholder={t("texts.properties.slug_placeholder")}
          />
          <Form.TextArea
            wide
            label={t("texts.properties.descript_label")}
            name="attributes[description]"
            placeholder={t("texts.properties.descript_placeholder")}
          />
          <Form.Upload
            wide
            layout="portrait"
            label={t("texts.properties.cover_label")}
            accepts="images"
            readFrom="attributes[coverStyles][small]"
            name="attributes[cover]"
            remove="attributes[removeCover]"
            altTextName={"attributes[coverAltText]"}
            altTextLabel={t("hero.cover_image_alt_label")}
          />
        </Form.FieldGroup>
        <Form.FieldGroup label={t("texts.properties.presentation_header")}>
          <Form.Switch
            wide
            instructions={t("texts.properties.published_instructions")}
            label={t("texts.properties.published_label")}
            name="attributes[published]"
          />
          <Form.TextInput
            wide
            label={t("texts.properties.section_label")}
            name="attributes[sectionKind]"
            placeholder={t("texts.properties.section_placeholder")}
            instructions={t("texts.properties.section_instructions")}
          />
        </Form.FieldGroup>
        <Form.FieldGroup label={t("texts.properties.access_header")}>
          <Form.Switch
            wide
            label={t("texts.properties.ignore_label")}
            instructions={t("texts.properties.ignore_instructions")}
            name="attributes[ignoreAccessRestrictions]"
          />
        </Form.FieldGroup>
        <Form.Save text={t("texts.properties.save")} />
      </FormContainer.Form>
    </section>
  );
}

TextPropertiesContainer.displayName = "Text.Properties";

TextPropertiesContainer.propTypes = {
  text: PropTypes.object
};
