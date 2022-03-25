import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

function CloseButton({ onClick }) {
  const { t } = useTranslation();

  return (
    <button onClick={onClick} className="overlay-close">
      <span className="overlay-close__text">{t("actions.close")}</span>
      <IconComposer
        icon="close24"
        size="default"
        className="overlay-close__icon"
      />
    </button>
  );
}

CloseButton.displayName = "Global.Overlay.Header.Close";

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CloseButton;
