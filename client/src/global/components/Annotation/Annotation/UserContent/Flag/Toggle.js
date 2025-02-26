import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useApiCallback } from "hooks";
import { annotationsAPI, commentsAPI } from "api";
import Modal from "./Modal";
import * as Styled from "../styles";

export default function FlagModalToggle({ record, annotationId }) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const unflagAnnotation = useApiCallback(annotationsAPI.unflag);
  const unflagComment = useApiCallback(commentsAPI.unflag);

  const handleUnflag =
    record.type === "annotations" ? unflagAnnotation : unflagComment;

  return (
    <>
      {record?.attributes?.flagged ? (
        <Styled.SecondaryButton onClick={() => handleUnflag(record.id)}>
          {t("actions.unflag")}
        </Styled.SecondaryButton>
      ) : (
        <Styled.SecondaryButton onClick={() => setOpen(true)}>
          {t("actions.report")}
        </Styled.SecondaryButton>
      )}
      {open && (
        <Modal
          setOpen={setOpen}
          id={record.id}
          annotationId={annotationId}
          type={record.type}
        />
      )}
    </>
  );
}

FlagModalToggle.displayName = "Annotation.Annotation.UserContent.FlagToggle";

FlagModalToggle.propTypes = {
  record: PropTypes.object.isRequired,
  annotationId: PropTypes.string
};
