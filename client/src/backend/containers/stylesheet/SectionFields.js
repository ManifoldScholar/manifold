import React from "react";
import { useTranslation } from "react-i18next";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import Form from "global/components/form";
import Collapse from "global/components/Collapse";
import * as Styled from "./styles";

export default function SectionFields({ visible, options }) {
  const { t } = useTranslation();
  const { toggleProps } = useCollapseContext();

  const collapseProps = {
    "aria-controls": toggleProps["aria-controls"],
    "aria-expanded": visible
  };

  return (
    <Form.FieldGroup>
      <Styled.Switch
        wide
        label={t("texts.stylesheets.edit.all_sections_label")}
        name="attributes[appliesToAllTextSections]"
        instructions={t("texts.stylesheets.edit.all_sections_instructions")}
        collapseProps={collapseProps}
      />
      <Collapse.Content visible={visible}>
        <Form.Picker
          label={t("texts.stylesheets.edit.sections_label")}
          placeholder={t("texts.stylesheets.edit.sections_placeholder")}
          name="relationships[textSections]"
          optionToLabel={text => text.attributes.name}
          options={options}
          rowProps={{ namePath: "attributes.title" }}
          showAddRemoveAll
        />
      </Collapse.Content>
    </Form.FieldGroup>
  );
}
