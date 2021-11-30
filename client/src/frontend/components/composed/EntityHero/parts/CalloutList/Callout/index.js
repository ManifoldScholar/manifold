import React from "react";
import PropTypes from "prop-types";
import { getButtonParams } from "./params";
import UserLink from "global/components/helper/UserLink";
import * as Styled from "./styles";

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

const styleProps = (type, lightMode) => {
  switch (type) {
    case "READ":
      return { $color: "primary", $lightMode: lightMode };
    case "DOWNLOAD":
      return { $color: "secondary", $lightMode: lightMode };
    case "TOC":
      return { $color: "secondary", $lightMode: lightMode };
    case "LINK":
      return { $color: "secondary", $layout: "center", $lightMode: lightMode };
    case "ERROR":
      return { $color: "error", $layout: "center", $lightMode: lightMode };
    default:
      return {};
  }
};

export default function Callout({
  callout,
  showErrors = false,
  link = false,
  lightMode = true
}) {
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
  const TextComponent = link ? "span" : Styled.ButtonText;

  return (
    <CalloutComponent
      as={as === "UserLink" ? UserLink : as}
      {...calloutProps(as, url)}
      {...styleProps(type, lightMode)}
    >
      {icon && (
        <IconComponent icon={icon} size={iconSize} {...styleProps(type)} />
      )}
      <TextComponent>{title ?? message}</TextComponent>
    </CalloutComponent>
  );
}

Callout.propTypes = {
  callout: PropTypes.object.isRequired,
  showErrors: PropTypes.bool,
  link: PropTypes.bool,
  lightMode: PropTypes.bool
};
