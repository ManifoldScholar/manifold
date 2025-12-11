import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Warning from "../../Warning";
import { generateError, getDefaultError } from "./errors";

function getErrorMessages(block) {
  const errors = block.attributes.incompleteRenderAttributes
    .map(key => {
      const error = generateError(key, block);
      if (!error) return null;
      return <span key={key}>{error}</span>;
    })
    .filter(Boolean);

  if (errors.length) return errors;

  const defaultError = getDefaultError(block);
  return defaultError;
}

function Incomplete({ block }) {
  const { t } = useTranslation();

  const errorMessages = getErrorMessages(block);

  return (
    <Warning
      icon="warningSign64"
      heading={t("messages.content_block_warning_heading")}
      body={errorMessages}
      note={t("messages.content_block_warning_note")}
    />
  );
}

Incomplete.displayName = "ContentBlock.Warning.Incomplete";

Incomplete.propTypes = {
  block: PropTypes.object.isRequired
};

export default Incomplete;
