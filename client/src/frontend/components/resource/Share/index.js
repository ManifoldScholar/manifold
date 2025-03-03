import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useShare from "hooks/useShare";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "../Link/styles";

export default function Share({ title }) {
  const { t } = useTranslation();

  const { disabled, canRender, onClick, icon, label } = useShare(title);

  return canRender ? (
    <Styled.Link
      as="button"
      className="button-primary"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="button-primary__text" aria-hidden>
        {label}
      </span>
      <span className="screen-reader-text">
        {label === "Copy"
          ? t("actions.copy_link_to", { title })
          : t("actions.share_title", { title })}
      </span>
      <IconComposer icon={icon} size={16} className="button-primary__icon" />
    </Styled.Link>
  ) : null;
}

Share.displayName = "Resource.Detail.Share";

Share.propTypes = {
  title: PropTypes.string.isRequired
};
