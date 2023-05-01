import React, { useCallback, useState, useRef } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import RichText from "global/components/form/RichText";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { sectionsAPI } from "api";
import { useHistory } from "react-router-dom";
import {
  serializeToHtml,
  removeFormatting
} from "global/components/form/RichText/serializers";
import * as Styled from "./styles";

export default function EditSectionForm({
  section,
  textId,
  globalStylesheet,
  refresh
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const formatData = (data, model) => {
    const { body, name } = data.attributes ?? {};
    const { position, kind } = model.attributes ?? {};
    if (!body) return { attributes: { position, kind, name, body: null } };
    if (typeof body === "string")
      return {
        attributes: {
          position,
          kind,
          name,
          body: removeFormatting(body)
        }
      };
    return {
      attributes: { position, kind, name, body: serializeToHtml(body) }
    };
  };

  const [closeOnSave, setCloseOnSave] = useState(false);

  const onSuccess = useCallback(() => {
    if (!closeOnSave) return;
    if (refresh) refresh();
    history.push(lh.link("backendTextSections", textId));
  }, [history, textId, refresh, closeOnSave]);

  const [hasErrors, setHasErrors] = useState(false);
  const [warnErrors, setWarnErrors] = useState(false);
  const errorProps = {
    hasErrors,
    setHasErrors,
    warnErrors,
    setWarnErrors
  };

  const stylesheets = Array.isArray(section?.relationships.stylesheets)
    ? [...section?.relationships.stylesheets, globalStylesheet]
    : globalStylesheet;

  const handleSaveAndCloseClick = e => {
    if (hasErrors) {
      e.preventDefault();
      return setWarnErrors("save");
    }
    setCloseOnSave(true);
  };

  const saveRef = useRef();

  return section ? (
    <Styled.Form
      model={section}
      name={"be-text-section-update"}
      className="form-secondary"
      onSuccess={onSuccess}
      formatData={formatData}
      update={sectionsAPI.update}
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.section.section_name")}
        placeholder={t("texts.section.section_name")}
        name="attributes[name]"
      />
      <RichText
        name="attributes[body]"
        sectionId={section.id}
        sectionBody={section.attributes.body}
        stylesheets={stylesheets}
        nextRef={saveRef}
        {...errorProps}
      />
      <Styled.ButtonOverlay>
        <Form.DrawerButtons
          showCancel
          showSaveAndClose
          cancelUrl={lh.link("backendTextSections", textId)}
          submitLabel="actions.save"
          onSaveAndCloseClick={handleSaveAndCloseClick}
          saveRef={saveRef}
        />
      </Styled.ButtonOverlay>
    </Styled.Form>
  ) : null;
}

EditSectionForm.displayName = "Text.Sections.EditForm";

EditSectionForm.propTypes = {
  textId: PropTypes.string.isRequired,
  section: PropTypes.object,
  refresh: PropTypes.func,
  nextPosition: PropTypes.number
};
