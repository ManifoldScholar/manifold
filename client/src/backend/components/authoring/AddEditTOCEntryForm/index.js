import React from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";

export default function AddEditTOCEntryForm({
  entry = {},
  textId,
  sections,
  onSuccess
}) {
  const { t } = useTranslation();

  const editEntry = () => {};
  const addEntry = () => {};

  const sectionOptions = sections.map(s => ({
    value: s.id,
    label: s.name,
    key: s.id
  }));

  return (
    <FormContainer.Form
      model={entry}
      name="tbd"
      className="form-secondary"
      onSuccess={onSuccess}
      update={editEntry}
      create={addEntry}
    >
      <Form.TextInput
        focusOnMount
        label={t("backend.forms.text_toc.entry_name")}
        placeholder={t("backend.forms.text_toc.entry_name")}
        value={entry?.name}
      />
      <Form.FieldGroup
        label={t("backend.forms.text_toc.section_link")}
        instructions={t("backend.forms.text_toc.section_link_instructions")}
      >
        <Form.Select
          options={[
            {
              value: "",
              label: t("backend.forms.text_toc.section_link_placeholder"),
              key: 0
            },
            ...sectionOptions
          ]}
          rounded
          wide
          hideLabel
        />
      </Form.FieldGroup>
      <Form.FieldGroup
        label={t("backend.forms.text_toc.anchor_link")}
        instructions={t("backend.forms.text_toc.anchor_link_instructions")}
      >
        <Form.TextInput placeholder="#" />
      </Form.FieldGroup>
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendTextTOC", textId)}
        submitLabel="backend.forms.text_toc.save_button_label"
      />
    </FormContainer.Form>
  );
}

AddEditTOCEntryForm.displayName = "Text.TOC.AddEditEntryForm";

AddEditTOCEntryForm.propTypes = {
  text: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
};
