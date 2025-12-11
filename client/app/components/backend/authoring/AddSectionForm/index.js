import { useRef, useMemo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormContainer from "components/global/form/Container";
import Form from "components/global/form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import * as Styled from "./styles";

export default function AddSectionForm({ textId, nextPosition, fetcher }) {
  const { t } = useTranslation();
  const intentRef = useRef(null);

  const defaultModel = useMemo(
    () => ({
      attributes: { position: nextPosition, kind: "section" }
    }),
    [nextPosition]
  );

  const formatData = (data, model) => {
    const { name } = data.attributes ?? {};
    const { position, kind } = model.attributes ?? {};
    const formatted = { attributes: { position, kind, name } };
    if (intentRef.current) {
      formatted.intent = intentRef.current;
      intentRef.current = null;
    }
    return formatted;
  };

  const buttonClasses = "button-secondary button-secondary--outlined";
  const cancelUrl = `/backend/projects/text/${textId}/sections`;

  return (
    <FormContainer.Form
      model={defaultModel}
      name={"be-text-section-create"}
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
      <Styled.ButtonGroup>
        <button
          type="submit"
          className={buttonClasses}
          onClick={() => {
            intentRef.current = "editor";
          }}
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
          <Link
            to={cancelUrl}
            className={classNames(buttonClasses, "button-secondary--dull")}
          >
            <span>{t("actions.cancel")}</span>
          </Link>
        </Styled.ButtonRow>
      </Styled.ButtonGroup>
    </FormContainer.Form>
  );
}

AddSectionForm.displayName = "Text.Sections.AddForm";

AddSectionForm.propTypes = {
  textId: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  nextPosition: PropTypes.number
};
