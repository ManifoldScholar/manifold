import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { sectionsAPI } from "api";
import { useHistory } from "react-router-dom";

export default function AddEditSectionForm({
  section,
  textId,
  nextPosition,
  refresh
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const defaultModel = {
    attributes: { position: nextPosition, kind: "section" }
  };

  const createSection = model => {
    return sectionsAPI.create(textId, model);
  };

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    history.push(lh.link("backendTextSections", textId));
  }, [history, textId, refresh]);

  return (
    <FormContainer.Form
      model={section ?? defaultModel}
      name={section ? "be-text-section-update" : "be-text-section-create"}
      className="form-secondary"
      onSuccess={onSuccess}
      create={createSection}
      update={sectionsAPI.update}
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.section.section_name")}
        placeholder={t("texts.section.section_name")}
        name="attributes[name]"
      />
      {/* <Form.CodeArea
        label={t("texts.section.content_label")}
        instructions={t("texts.section.content_instructions")}
        height="600px"
        mode="html"
        name="attributes[body]"
      /> */}
      <Form.RichText
        label={t("texts.section.content_label")}
        instructions={"Rich text section content"}
        name="attributes[body]"
      />
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendTextSections", textId)}
        submitLabel="texts.section.save_button_label"
      />
    </FormContainer.Form>
  );
}

AddEditSectionForm.displayName = "Text.Sections.AddEditForm";

AddEditSectionForm.propTypes = {
  textId: PropTypes.string.isRequired,
  section: PropTypes.object,
  refresh: PropTypes.func,
  nextPosition: PropTypes.number
};
