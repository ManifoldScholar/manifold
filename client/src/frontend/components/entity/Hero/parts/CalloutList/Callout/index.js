import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getCalloutParams } from "./params";
import Button from "global/components/atomic/Button";
import UserLink from "global/components/helper/UserLink";
import * as Styled from "./styles";

const navProps = (as, url, type) => {
  switch (as) {
    case "a":
      return {
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
        download: type === "DOWNLOAD"
      };
    case "UserLink":
      return { url };
    default:
      return { to: url };
  }
};

export default function Callout({
  callout,
  showErrors = false,
  isLink = false,
  buttonSize,
  darkMode = false
}) {
  const { t } = useTranslation();
  const type =
    (callout.attributes.kind === "read" || callout.attributes.kind === "toc") &&
    !callout.relationships.text
      ? "ERROR"
      : callout.attributes.kind.toUpperCase();

  if (type === "ERROR") {
    if (!showErrors) {
      return null;
    }
    return isLink ? (
      <Styled.ErrorLink as="span">{t("errors.text_missing")}</Styled.ErrorLink>
    ) : (
      <Styled.ErrorButton as="span" size={buttonSize}>
        {t("errors.text_missing")}
      </Styled.ErrorButton>
    );
  }

  const {
    icon,
    iconSize,
    url,
    title,
    as,
    primary,
    mismatch
  } = getCalloutParams(callout, type, isLink, t);

  if (mismatch) return null;

  return isLink ? (
    <Styled.LinkCallout
      as={as === "UserLink" ? UserLink : as}
      {...navProps(as, url, type)}
    >
      {icon && <Styled.LinkIcon icon={icon} size={iconSize} />}
      <span>{title}</span>
    </Styled.LinkCallout>
  ) : (
    <Button
      as={as === "UserLink" ? UserLink : as}
      {...navProps(as, url, type)}
      size={buttonSize}
      dark={darkMode}
      secondary={!primary}
      icon={icon}
      iconSize={iconSize}
    >
      {title}
    </Button>
  );
}

Callout.displayName = "Frontend.Entity.Hero.Parts.Callout";

Callout.propTypes = {
  callout: PropTypes.object.isRequired,
  showErrors: PropTypes.bool,
  isLink: PropTypes.bool,
  darkMode: PropTypes.bool,
  buttonSize: PropTypes.oneOf(["sm", "lg"])
};
