import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { textsAPI } from "api";
import { useHistory } from "react-router-dom";
import {
  formatTreeData,
  formatTOCData
} from "backend/components/authoring/TOCList/treeHelpers";

export default function AddEditTOCEntryForm({
  entry,
  tree,
  toc,
  textId,
  sections,
  setTree
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const formatDataOnSubmit = useCallback(
    (data, model) => {
      if (entry) {
        const update = {
          ...entry,
          data: {
            sectionId: data.sectionId ?? model.sectionId,
            title: data.label ?? model.label,
            anchor: data.anchor ?? model.anchor,
            type: entry.data.type
          }
        };

        const newTree = {
          ...tree,
          items: { ...tree.items, [entry.id]: update }
        };
        const newToc = formatTOCData(newTree);
        return {
          attributes: { toc: newToc }
        };
      }

      const newEntry = {
        id: data.sectionId,
        label: data.label,
        anchor: data.anchor
      };
      const newToc = [...toc, newEntry];
      return {
        attributes: { toc: newToc }
      };
    },
    [toc, entry, tree]
  );

  const onSuccess = useCallback(() => {
    // attributes aren't current included in the response in the store that can be passed directly to this callback, so using the toc prop here.
    setTree(formatTreeData(toc));
    history.push(lh.link("backendTextTOC", textId));
  }, [textId, history, toc, setTree]);

  const sectionOptions = sections.map(s => ({
    value: s.id,
    label: s.name,
    key: s.id
  }));

  const { id: sectionId, title: label, ...rest } = entry?.data ?? {};

  return (
    <FormContainer.Form
      model={{ id: textId, sectionId, label, ...rest }}
      name="be-text-update"
      className="form-secondary"
      update={textsAPI.update}
      formatData={formatDataOnSubmit}
      onSuccess={onSuccess}
      groupErrors
    >
      <Form.TextInput
        focusOnMount
        label={t("backend.forms.text_toc.entry_name")}
        placeholder={t("backend.forms.text_toc.entry_name")}
        name="label"
      />
      <Form.FieldGroup
        name="sectionId"
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
        <Form.TextInput placeholder="#" name="anchor" />
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
  textId: PropTypes.string.isRequired,
  entry: PropTypes.object,
  sections: PropTypes.array,
  toc: PropTypes.array.isRequired,
  setTree: PropTypes.func.isRequired,
  tree: PropTypes.object
};
