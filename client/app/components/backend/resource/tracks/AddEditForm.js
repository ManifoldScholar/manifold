import React from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "components/global/form";
import { useTranslation } from "react-i18next";
import Upload from "components/global/form/Upload";

export default function AddEditForm({ resource, track, fetcher }) {
  const { t } = useTranslation();

  return (
    <FormContainer.Form
      model={track}
      fetcher={fetcher}
      className="form-secondary"
    >
      <Form.Select
        label={t("records.tracks.kind")}
        name="attributes[kind]"
        focusOnMount
        options={[
          {
            value: "",
            label: t("records.tracks.kind_placeholder")
          },
          {
            value: "captions",
            label: t("records.tracks.kind_captions")
          },
          {
            value: "subtitles",
            label: t("records.tracks.kind_subtitles")
          },
          {
            value: "chapters",
            label: t("records.tracks.kind_chapters")
          },
          {
            value: "metadata",
            label: t("records.tracks.kind_metadata")
          }
        ]}
      />
      <Form.TextInput
        label={t("records.tracks.label")}
        name="attributes[label]"
        placeholder={t("records.tracks.label_placeholder")}
      />
      <Form.TextInput
        label={t("records.tracks.srclang")}
        name="attributes[srclang]"
        instructions={t("records.tracks.srclang_instructions")}
        placeholder={t("records.tracks.srclang_placeholder")}
      />
      <Upload
        label={t("records.tracks.cues")}
        name="attributes[cues]"
        accepts="vtt"
        readFrom="attributes[cuesFileName]"
        remove="attributes[removeCues]"
      />
      <Form.DrawerButtons
        showCancel
        cancelUrl={`/backend/projects/resource/${resource?.id}/tracks`}
        submitLabel={track ? t("actions.save") : t("actions.add")}
      />
    </FormContainer.Form>
  );
}

AddEditForm.propTypes = {
  resource: PropTypes.object.isRequired,
  track: PropTypes.object,
  fetcher: PropTypes.object.isRequired
};
