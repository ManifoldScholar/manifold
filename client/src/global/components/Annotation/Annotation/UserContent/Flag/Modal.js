import React, { useState, useCallback } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { useTranslation } from "react-i18next";
import Wrapper from "global/components/dialog/Wrapper";
import { Unwrapped } from "global/components/form";
import IconComposer from "global/components/utility/IconComposer";
import { FormContext } from "helpers/contexts";
import { useApiCallback } from "hooks";
import { annotationsAPI, commentsAPI } from "api";
import * as Styled from "./styles";

export default function FlagAnnotationModal({
  setOpen,
  id,
  annotationId,
  type
}) {
  const { t } = useTranslation();

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const uid = useUID();
  const errorId = `${uid}-error`;

  const flagAnnotation = useApiCallback(annotationsAPI.flag);
  const flagComment = useApiCallback(commentsAPI.flag, {
    refreshes: `comments-for-${annotationId}`
  });

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        const handleFlag =
          type === "annotations" ? flagAnnotation : flagComment;
        const res = await handleFlag(id, message);
        if (res?.data) return setOpen(false);
      } catch (err) {
        setErrors(err);
      }
    },
    [id, type, message, flagAnnotation, flagComment, setOpen]
  );

  const buttonClasses = classNames(
    "buttons-icon-horizontal__button",
    "buttons-icon-horizontal__button--in-dialog",
    "button-icon-secondary"
  );

  return (
    <Wrapper
      className="dialog"
      maxWidth={600}
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <header className="dialog__header">
        <h2>
          {t("reader.report_annotation.header", {
            type:
              type === "annotations"
                ? t("glossary.annotation_title_case_one")
                : t("glossary.comment_title_case_one")
          })}
        </h2>
      </header>
      <p>{t("reader.report_annotation.instructions")}</p>
      <FormContext.Provider value={{ styleType: "primary" }}>
        <Styled.Form className="dialog__body">
          <Unwrapped.TextArea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            id={uid}
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
              className={classNames(
                buttonClasses,
                "button-icon-secondary--red"
              )}
              onClick={handleSubmit}
            >
              <IconComposer
                icon="checkmark16"
                size="default"
                className="button-icon-secondary__icon"
              />
              {t("actions.report")}
            </button>
            <button
              className={classNames(
                buttonClasses,
                "button-icon-secondary--dull"
              )}
              onClick={() => setOpen(false)}
            >
              <IconComposer
                icon="close16"
                size="default"
                className="button-icon-secondary__icon"
              />
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
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  annotationId: PropTypes.string
};
