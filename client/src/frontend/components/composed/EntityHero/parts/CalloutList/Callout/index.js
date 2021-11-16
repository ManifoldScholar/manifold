import React from "react";
import PropTypes from "prop-types";
import { getButtonParams } from "./params";
import UserLink from "global/components/helper/UserLink";
import * as Styled from "../styles";

const calloutProps = (as, url) => {
  switch (as) {
    case "a":
      return { href: url, target: "_blank", rel: "noopener noreferrer" };
    case "UserLink":
      return { url };
    case "span":
      return {};
    default:
      return { to: url };
  }
};

const styleProps = type => {
  switch (type) {
    case "READ":
      return { $color: "primary" };
    case "DOWNLOAD":
      return { $color: "secondary" };
    case "TOC":
      return { $color: "secondary" };
    case "LINK":
      return { $color: "secondary", $layout: "center" };
    case "ERROR":
      return { $color: "error", $layout: "center" };
    default:
      return {};
  }
};

export default function Callout({ callout, showErrors = false, link = false }) {
  const type =
    (callout.attributes.kind === "read" || callout.attributes.kind === "toc") &&
    !callout.relationships.text
      ? "ERROR"
      : callout.attributes.kind.toUpperCase();
  if (type === "ERROR" && !showErrors) return null;

  const { icon, iconSize, url, title, message, as, mismatch } = getButtonParams(
    callout,
    type
  );
  if (mismatch) return null;

  const CalloutComponent = link ? Styled.LinkCallout : Styled.ButtonCallout;
  const IconComponent = link ? Styled.LinkIcon : Styled.ButtonIcon;
  const TextComponent = link ? Styled.LinkText : Styled.ButtonText;

  return (
    <CalloutComponent
      as={as === "UserLink" ? UserLink : as}
      {...calloutProps(as, url)}
      {...styleProps(type)}
    >
      <IconComponent icon={icon} size={iconSize} {...styleProps(type)} />
      <TextComponent>{title ?? message}</TextComponent>
    </CalloutComponent>
  );
}

Callout.propTypes = {
  callout: PropTypes.object.isRequired,
  showErrors: PropTypes.bool,
  link: PropTypes.bool
};
