import React from "react";
import PropTypes from "prop-types";
import { getCalloutParams } from "./params";
import Button from "global/components/atomic/Button";
import UserLink from "global/components/helper/UserLink";
import * as Styled from "./styles";

const navProps = (as, url) => {
  switch (as) {
    case "a":
      return { href: url, target: "_blank", rel: "noopener noreferrer" };
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
  lightMode = true
}) {
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
      <Styled.ErrorLink as="span">Text Missing</Styled.ErrorLink>
    ) : (
      <Styled.ErrorButton as="span" size={buttonSize}>
        Text Missing
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
  } = getCalloutParams(callout, type, isLink);
  if (mismatch) return null;

  return isLink ? (
    <Styled.LinkCallout
      as={as === "UserLink" ? UserLink : as}
      {...navProps(as, url)}
    >
      {icon && <Styled.LinkIcon icon={icon} size={iconSize} />}
      <span>{title}</span>
    </Styled.LinkCallout>
  ) : (
    <Button
      as={as === "UserLink" ? UserLink : as}
      {...navProps(as, url)}
      size={buttonSize}
      dark={!lightMode}
      secondary={!primary}
      icon={icon}
      iconSize={iconSize}
    >
      {title}
    </Button>
  );
}

Callout.displayName = "Frontend.Composed.EntityHero.Parts.Callout";

Callout.propTypes = {
  callout: PropTypes.object.isRequired,
  showErrors: PropTypes.bool,
  isLink: PropTypes.bool,
  lightMode: PropTypes.bool,
  buttonSize: PropTypes.oneOf(["sm", "lg"])
};
