import { useMemo } from "react";
import PropTypes from "prop-types";
import FormContainer from "components/global/form/Container";
import Form from "components/global/form";
import { useTranslation } from "react-i18next";

export default function AddEditTOCEntryForm({
  entry,
  textId,
  sections,
  fetcher,
  formatData
}) {
  const { t } = useTranslation();

  const sectionOptions = sections.map(s => ({
    value: s.id,
    label: s.name,
    key: s.id
  }));

  const { sectionId, title: label, anchor } = entry?.data ?? {};

  const model = useMemo(() => ({ id: textId, sectionId, label, anchor }), [
    textId,
    sectionId,
    label,
    anchor
  ]);

  return (
    <FormContainer.Form
      model={model}
      className="form-secondary"
      fetcher={fetcher}
      formatData={formatData}
      groupErrors
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.toc.entry_name")}
        placeholder={t("texts.toc.entry_name")}
        name="label"
      />
      <Form.FieldGroup
        name="sectionId"
        label={t("texts.toc.section_link")}
        instructions={t("texts.toc.section_link_instructions")}
      >
        <Form.Select
          options={[
            {
              value: "",
              label: t("texts.toc.section_link_placeholder"),
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
        label={t("texts.toc.anchor_link")}
        instructions={t("texts.toc.anchor_link_instructions")}
      >
        <Form.TextInput placeholder="#" name="anchor" />
      </Form.FieldGroup>
      <Form.DrawerButtons
        showCancel
        cancelUrl={`/backend/projects/text/${textId}/contents`}
        submitLabel="texts.toc.save_button_label"
      />
    </FormContainer.Form>
  );
}

AddEditTOCEntryForm.displayName = "Text.TOC.AddEditEntryForm";

AddEditTOCEntryForm.propTypes = {
  textId: PropTypes.string.isRequired,
  entry: PropTypes.object,
  sections: PropTypes.array,
  fetcher: PropTypes.object.isRequired,
  formatData: PropTypes.func
};
