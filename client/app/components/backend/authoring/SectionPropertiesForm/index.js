import PropTypes from "prop-types";
import Form from "components/global/form";
import { useTranslation } from "react-i18next";

import * as Styled from "./styles";

export default function SectionPropertiesForm({
  section,
  textId,
  fetcher,
  startSectionId
}) {
  const { t } = useTranslation();

  const disableHide = startSectionId === section?.id;
  const hideInstructions = disableHide
    ? t("texts.section.hide_start_instructions")
    : t("texts.section.hide_instructions");

  return (
    <Styled.Form model={section} className="form-secondary" fetcher={fetcher}>
      <Form.TextInput
        focusOnMount
        label={t("texts.properties.slug_label")}
        placeholder={t("texts.properties.slug_placeholder")}
        name="attributes[slug]"
      />
      <Form.TextArea
        label={t("metadata.citation_override")}
        instructions={t("metadata.citation_override_instructions")}
        name="attributes[metadata][citationOverride]"
      />
      <Form.Switch
        label={t("texts.section.hide_label")}
        instructions={hideInstructions}
        name="attributes[hiddenInReader]"
        disabled={disableHide}
      />
      <Form.DrawerButtons
        showCancel
        cancelUrl={`/backend/projects/text/${textId}/sections`}
        submitLabel="actions.save"
      />
    </Styled.Form>
  );
}

SectionPropertiesForm.displayName = "Text.Sections.PropertiesForm";

SectionPropertiesForm.propTypes = {
  textId: PropTypes.string.isRequired,
  section: PropTypes.object,
  fetcher: PropTypes.object.isRequired,
  startSectionId: PropTypes.string
};
