import React from "react";
import PropTypes from "prop-types";
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
  const errorMessages = getErrorMessages(block);

  return (
    <Warning
      icon="warningSign64"
      heading="This content block needs your attention before it can be displayed."
      body={errorMessages}
      note="Note: This message is only visible to project editors."
    />
  );
}

Incomplete.displayName = "ContentBlock.Warning.Incomplete";

Incomplete.propTypes = {
  block: PropTypes.object.isRequired
};

export default Incomplete;
