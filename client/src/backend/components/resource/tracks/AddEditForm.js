import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import textTracksAPI from "api/resources/textTracks";
import { useNavigate } from "react-router-dom";
import Upload from "global/components/form/Upload";

export default function AddEditForm({ resource, track, refresh }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEdit = !!track;

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    navigate(lh.link("backendResourceTracks", resource?.id));
  }, [refresh, navigate, resource?.id]);

  return (
    <FormContainer.Form
      model={track}
      name={
        isEdit
          ? "backend-resource-track-update"
          : "backend-resource-track-create"
      }
      className="form-secondary"
      onSuccess={onSuccess}
      create={attrs => textTracksAPI.create(resource.id, attrs)}
      update={(id, attrs) => textTracksAPI.update(resource.id, id, attrs)}
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
        cancelUrl={lh.link("backendResourceTracks", resource?.id)}
        submitLabel={isEdit ? t("actions.save") : t("actions.add")}
      />
    </FormContainer.Form>
  );
}

AddEditForm.propTypes = {
  resource: PropTypes.object.isRequired,
  track: PropTypes.object,
  refresh: PropTypes.func.isRequired
};
