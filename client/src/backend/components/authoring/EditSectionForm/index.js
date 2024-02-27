import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect
} from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import ContentEditor from "global/components/form/ContentEditor";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { sectionsAPI } from "api";
import { useHistory } from "react-router-dom";
import { serializeToSlate } from "global/components/form/ContentEditor/serializers";
import { formatHtml } from "global/components/form/ContentEditor/utils/helpers";
import { useFromStore } from "hooks";
import has from "lodash/has";
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
  appliesToAllStylesheets,
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
          name: name ?? lastSavedName,
          body: lastSavedBody ?? null
        }
      };
    return {
      attributes: { position, kind, name, body }
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

  const stylesheetData = useFromStore(`entityStore.entities.stylesheets`);
  const stylesheetDataKeys = stylesheetData ? Object.keys(stylesheetData) : [];

  const appliedStylesheets = stylesheetDataKeys
    .filter(id => appliesToAllStylesheets.find(s => s === id))
    .map(id => stylesheetData[id]);

  const stylesheets = Array.isArray(section?.relationships.stylesheets)
    ? [...section?.relationships.stylesheets, ...appliedStylesheets]
    : [...appliedStylesheets];

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
  ) : null;
}

EditSectionForm.displayName = "Text.Sections.EditForm";

EditSectionForm.propTypes = {
  textId: PropTypes.string.isRequired,
  section: PropTypes.object,
  refresh: PropTypes.func,
  nextPosition: PropTypes.number
};
