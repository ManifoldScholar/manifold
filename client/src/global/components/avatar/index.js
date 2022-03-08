import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default function Avatar(props) {
  const { url, style, ariaHidden, className, iconSize = 64 } = props;

  const { t } = useTranslation();

  return url ? (
    <figure
      style={style}
      className={classNames("avatar", className)}
      aria-hidden={ariaHidden}
    >
      <span className="screen-reader-text">{t("glossary.avatar")}</span>
      <Styled.ImageAvatar $url={url} />
    </figure>
  ) : (
    <figure
      style={style}
      className={classNames("avatar", className)}
      aria-hidden={ariaHidden}
    >
      <Utility.IconComposer
        className={`avatar__icon`}
        icon={`Avatar${iconSize}`}
        size={iconSize}
      />
      <span className="screen-reader-text">{t("glossary.avatar")}</span>
    </figure>
  );
}

Avatar.propTypes = {
  url: PropTypes.string,
  style: PropTypes.object,
  ariaHidden: PropTypes.bool,
  className: PropTypes.string,
  iconSize: PropTypes.oneOf([16, 24, 64])
};
