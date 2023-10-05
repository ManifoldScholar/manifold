import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { sectionsAPI } from "api";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function SectionPropertiesForm({
  section,
  textId,
  refreshText,
  startSectionId
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const onSuccess = () => {
    if (refreshText) refreshText();
    history.push(lh.link("backendTextSections", textId));
  };

  const disableHide = startSectionId === section?.id;
  const hideInstructions = disableHide
    ? t("texts.section.hide_start_instructions")
    : t("texts.section.hide_instructions");

  return (
    <Styled.Form
      model={section}
      className="form-secondary"
      name="be-text-section-properties"
      update={sectionsAPI.update}
      onSuccess={onSuccess}
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.properties.slug_label")}
        placeholder={t("texts.properties.slug_placeholder")}
        name="attributes[slug]"
      />
      <Form.Switch
        label={t("texts.section.hide_label")}
        instructions={hideInstructions}
        name="attributes[hiddenInReader]"
        disabled={disableHide}
      />
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendTextSections", textId)}
        submitLabel="actions.save"
      />
    </Styled.Form>
  );
}

SectionPropertiesForm.displayName = "Text.Sections.PropertiesForm";

SectionPropertiesForm.propTypes = {
  textId: PropTypes.string.isRequired,
  section: PropTypes.object,
  refreshText: PropTypes.func.isRequired
};
