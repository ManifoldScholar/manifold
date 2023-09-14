import React, { useCallback, useMemo } from "react";
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
            anchor: data.anchor ?? model.anchor
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

  const onSuccess = useCallback(
    (_, res) => {
      setTree(formatTreeData(res.data?.attributes?.toc));
      history.push(lh.link("backendTextTOC", textId));
    },
    [textId, history, setTree]
  );

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
      name="be-text-update"
      className="form-secondary"
      update={textsAPI.update}
      formatData={formatDataOnSubmit}
      onSuccess={onSuccess}
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
        cancelUrl={lh.link("backendTextTOC", textId)}
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
  toc: PropTypes.array.isRequired,
  setTree: PropTypes.func.isRequired,
  tree: PropTypes.object
};
