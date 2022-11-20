import React from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";

export default function AddEditSectionForm({ section = {}, text, onSuccess }) {
  const { t } = useTranslation();

  const createSection = () => {};
  const editSection = () => {};

  return (
    <FormContainer.Form
      model={section}
      name="be-text-update"
      className="form-secondary"
      onSuccess={onSuccess}
      create={createSection}
      update={editSection}
    >
      <Form.TextInput
        focusOnMount
        label={t("backend.forms.text_section.section_name")}
        placeholder={t("backend.forms.text_section.section_name")}
        name="attributes[name]"
      />
      <Form.CodeArea
        label={t("backend.forms.text_section.content_label")}
        instructions={t("backend.forms.text_section.content_instructions")}
        height="600px"
        mode="html"
        name="attributes[body]"
      />
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendTextSections", text.id)}
        submitLabel="backend.forms.text_section.save_button_label"
      />
    </FormContainer.Form>
  );
}

AddEditSectionForm.displayName = "Text.Sections.AddEditForm";

AddEditSectionForm.propTypes = {
  text: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
};
