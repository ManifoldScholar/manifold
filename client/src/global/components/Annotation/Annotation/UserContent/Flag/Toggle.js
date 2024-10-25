import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useApiCallback } from "hooks";
import { annotationsAPI } from "api";
import Modal from "./Modal";
import * as Styled from "../styles";

export default function FlagModalToggle({ annotation }) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const unflagAnnotation = useApiCallback(annotationsAPI.unflag);

  return (
    <>
      {annotation?.attributes?.flagged ? (
        <Styled.SecondaryButton onClick={() => unflagAnnotation(annotation.id)}>
          {t("actions.unflag")}
        </Styled.SecondaryButton>
      ) : (
        <Styled.SecondaryButton onClick={() => setOpen(true)}>
          {t("actions.flag")}
        </Styled.SecondaryButton>
      )}
      {open && <Modal setOpen={setOpen} annotationId={annotation.id} />}
    </>
  );
}

FlagModalToggle.displayName = "Annotation.Annotation.UserContent.FlagToggle";

FlagModalToggle.propTypes = {
  annotation: PropTypes.object.isRequired
};
