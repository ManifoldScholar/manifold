import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { sectionsAPI } from "api";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function SectionPropertiesForm({ section, textId }) {
  const { t } = useTranslation();
  const history = useHistory();

  const onSuccess = () => {
    history.push(lh.link("backendTextSections", textId));
  };

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
  section: PropTypes.object
};
