import React, { useCallback, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import ContentEditor from "global/components/form/ContentEditor";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { sectionsAPI } from "api";
import { useHistory } from "react-router-dom";
import {
  serializeToHtml,
  serializeToSlate,
  removeFormatting
} from "global/components/form/ContentEditor/serializers";
import { formatHtml } from "global/components/form/ContentEditor/utils/helpers";
import * as Styled from "./styles";

const defaultValue = [
  {
    type: "section",
    children: [{ type: "p", children: [{ text: "" }] }]
  }
];

const getInitialSlateValue = value => {
  if (value && typeof value === "string") return serializeToSlate(value);
  return defaultValue;
};

const getInitialHtmlValue = value => {
  if (value && typeof value === "string") return formatHtml(value);
  return formatHtml("<!DOCTYPE html><section><p></p></section>");
};

export default function EditSectionForm({
  section,
  textId,
  globalStylesheet,
  refresh
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const initialSlateValue = useMemo(() => {
    return getInitialSlateValue(section?.attributes.body);
  }, [section?.attributes.body]);
  const initialHtmlValue = useMemo(
    () => getInitialHtmlValue(section?.attributes.body),
    [section?.attributes.body]
  );

  const formatData = (data, model) => {
    const { body, name } = data.attributes ?? {};
    const { position, kind, body: lastSavedBody, name: lastSavedName } =
      model.attributes ?? {};
    // Ensure we never clear out body if the user clicks Save multiple times without dirtying the form
    if (body === undefined)
      return {
        attributes: {
          position,
          kind,
          name: lastSavedName,
          body: lastSavedBody ?? null
        }
      };
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
    : [globalStylesheet];

  const handleSaveAndCloseClick = e => {
    if (hasErrors) {
      e.preventDefault();
      return setWarnErrors("save");
    }
    setCloseOnSave(true);
  };

  const saveRef = useRef();

  return (
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
      <ContentEditor
        name="attributes[body]"
        initialHtmlValue={initialHtmlValue}
        initialSlateValue={initialSlateValue}
        stylesheets={stylesheets}
        nextRef={saveRef}
        {...errorProps}
      />
      <Styled.ButtonOverlay id="editor-button-overlay">
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
  );
}

EditSectionForm.displayName = "Text.Sections.EditForm";

EditSectionForm.propTypes = {
  textId: PropTypes.string.isRequired,
  section: PropTypes.object,
  refresh: PropTypes.func,
  nextPosition: PropTypes.number
};
