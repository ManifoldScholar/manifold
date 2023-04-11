import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { sectionsAPI } from "api";
import { useHistory } from "react-router-dom";
import * as Styled from "./styles";

export default function AddSectionForm({ textId, nextPosition, refresh }) {
  const { t } = useTranslation();
  const history = useHistory();

  const [openInEditor, setOpenInEditor] = useState(false);

  const defaultModel = useMemo(
    () => ({
      attributes: { position: nextPosition, kind: "section" }
    }),
    [nextPosition]
  );

  const createSection = model => {
    return sectionsAPI.create(textId, model);
  };

  const formatData = (data, model) => {
    const { name } = data.attributes ?? {};
    const { position, kind } = model.attributes ?? {};
    return { attributes: { position, kind, name } };
  };

  const onSuccess = useCallback(
    res => {
      if (refresh) refresh();

      if (openInEditor)
        return history.push(lh.link("backendTextSectionEdit", textId, res.id));

      history.push(lh.link("backendTextSections", textId));
    },
    [history, textId, refresh, openInEditor]
  );

  const buttonClasses = "button-secondary button-secondary--outlined";

  const handleCancelClick = e => {
    e.preventDefault();
    history.push(lh.link("backendTextSections", textId));
  };

  const handleEditorClick = () => {
    setOpenInEditor(true);
  };

  return (
    <FormContainer.Form
      model={defaultModel}
      name={"be-text-section-create"}
      className="form-secondary"
      onSuccess={onSuccess}
      formatData={formatData}
      create={createSection}
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.section.section_name")}
        placeholder={t("texts.section.section_name")}
        name="attributes[name]"
      />
      <Styled.ButtonGroup>
        <button
          type="submit"
          className={buttonClasses}
          onClick={handleEditorClick}
        >
          <span>{t("texts.section.save_and_open_label")}</span>
        </button>
        <Styled.ButtonRow>
          <button
            type="submit"
            className={classNames(buttonClasses, "button-secondary--dull")}
          >
            <span>{t("actions.save")}</span>
          </button>
          <button
            onClick={handleCancelClick}
            className={classNames(buttonClasses, "button-secondary--dull")}
          >
            <span>{t("actions.cancel")}</span>
          </button>
        </Styled.ButtonRow>
      </Styled.ButtonGroup>
    </FormContainer.Form>
  );
}

AddSectionForm.displayName = "Text.Sections.AddForm";

AddSectionForm.propTypes = {
  textId: PropTypes.string.isRequired,
  refresh: PropTypes.func,
  nextPosition: PropTypes.number
};
