import React, { useState, useCallback } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { useTranslation } from "react-i18next";
import Wrapper from "global/components/dialog/Wrapper";
import { Unwrapped } from "global/components/form";
import { FormContext } from "helpers/contexts";
import { useApiCallback } from "hooks";
import { annotationsAPI } from "api";
import * as Styled from "./styles";

export default function FlagAnnotationModal({ setOpen, annotationId }) {
  const { t } = useTranslation();

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const id = useUID();
  const errorId = `${id}-error`;

  const flagAnnotation = useApiCallback(annotationsAPI.flag);

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        const res = await flagAnnotation(annotationId, message);
        if (res?.data) return setOpen(false);
      } catch (err) {
        setErrors(err);
      }
    },
    [annotationId, message, flagAnnotation, setOpen]
  );

  return (
    <Wrapper
      className="dialog"
      maxWidth={800}
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <header className="dialog__header">
        <h2>{t("reader.report_annotation.header")}</h2>
      </header>
      <Styled.Instructions>
        {t("reader.report_annotation.instructions")}
      </Styled.Instructions>
      <FormContext.Provider value={{ styleType: "primary" }}>
        <Styled.Form className="dialog_body">
          <Unwrapped.TextArea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            id={id}
            placeholder={t("reader.report_annotation.placeholder")}
            aria-describedby={errorId}
            name="message"
            errors={errors}
            idForError={errorId}
            label={t("reader.report_annotation.message_input_label")}
          />
          <Styled.ButtonGroup>
            <button
              type="submit"
              className={classNames("button-tertiary button-tertiary--red")}
              onClick={handleSubmit}
            >
              {t("actions.report")}
            </button>
            <button
              className={classNames(
                "button-tertiary button-tertiary--neutral button-primary--rounded"
              )}
              onClick={() => setOpen(false)}
            >
              {t("actions.cancel")}
            </button>
          </Styled.ButtonGroup>
        </Styled.Form>
      </FormContext.Provider>
    </Wrapper>
  );
}

FlagAnnotationModal.displayName = "Annotation.Annotation.UserContent.FlagModal";

FlagAnnotationModal.propTypes = {
  annotationId: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired
};
