import React, { useState, useRef, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import Form from "components/global/form";
import ContentEditor from "components/global/form/ContentEditor";
import { useTranslation } from "react-i18next";

import { serializeToSlate } from "components/global/form/ContentEditor/serializers";
import { formatHtml } from "components/global/form/ContentEditor/utils/helpers";
import { has } from "lodash-es";
import * as Styled from "./styles";

const defaultValue = [
  {
    type: "section",
    children: [{ type: "p", children: [{ text: "" }] }],
    slateOnly: true
  }
];

const getInitialSlateValue = value => {
  if (value && typeof value === "string")
    try {
      return serializeToSlate(formatHtml(value));
    } catch (e) {
      return { error: "serializer error", default: defaultValue };
    }

  return defaultValue;
};

const getInitialHtmlValue = value => {
  if (value && typeof value === "string") return formatHtml(value);
  return formatHtml("<!DOCTYPE html><section><p></p></section>");
};

export default function EditSectionForm({
  section,
  textId,
  fetcher,
  stylesheets
}) {
  const { t } = useTranslation();
  const intentRef = useRef(null);

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
    const formatted =
      body === undefined
        ? {
            attributes: {
              position,
              kind,
              name: name ?? lastSavedName,
              body: lastSavedBody ?? null
            }
          }
        : { attributes: { position, kind, name, body } };
    if (intentRef.current) {
      formatted.intent = intentRef.current;
      intentRef.current = null;
    }
    return formatted;
  };

  const [hasErrors, setHasErrors] = useState(false);
  const [warnErrors, setWarnErrors] = useState(false);
  const errorProps = {
    hasErrors,
    setHasErrors,
    warnErrors,
    setWarnErrors
  };

  useEffect(() => {
    if (has(initialSlateValue, "error")) {
      setHasErrors([
        {
          source: { pointer: "/data/attributes/body" },
          detail: t(`errors.invalid_html_switch`)
        }
      ]);
      setWarnErrors("switch");
    }
  }, [initialSlateValue, t]);

  const handleSaveAndCloseClick = e => {
    if (hasErrors) {
      e.preventDefault();
      return setWarnErrors("save");
    }
    intentRef.current = "close";
  };

  const saveRef = useRef();

  return section ? (
    <Styled.Form
      model={section}
      name={"be-text-section-update"}
      className="form-secondary"
      formatData={formatData}
      fetcher={fetcher}
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
          cancelUrl={`/backend/projects/text/${textId}/sections`}
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
  fetcher: PropTypes.object.isRequired,
  stylesheets: PropTypes.array
};
