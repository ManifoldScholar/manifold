import React, { Fragment } from "react";
import PropTypes from "prop-types";
import partition from "lodash/partition";
import Callout from "./Callout/index";
import * as Styled from "./styles";

export default function HeroCalloutList({
  callouts,
  authorized,
  showErrors = false,
  inline = false,
  mobileVisible = false,
  darkMode = false,
  buttonSize = "lg",
  track
}) {
  const visible = authorized
    ? callouts
    : callouts.filter(
        callout =>
          callout.attributes.visibility === "always" ||
          callout.attributes.visibility === "unauthorized"
      );
  const [buttons, links] = partition(visible, "attributes.button");

  const ButtonTag = buttons.length > 1 ? Styled.ButtonListItem : Fragment;
  const LinkTag = links.length > 1 ? "li" : Fragment;

  return (
    <Styled.Wrapper $mobile={mobileVisible}>
      {buttons.length > 0 && (
        <Styled.List $inline={inline} as={buttons.length > 1 ? "ul" : "div"}>
          {buttons.map(callout => (
            <ButtonTag>
              <Callout
                showErrors={showErrors}
                key={callout.id}
                callout={callout}
                darkMode={darkMode}
                buttonSize={buttonSize}
                track={track}
              />
            </ButtonTag>
          ))}
        </Styled.List>
      )}
      {links.length > 0 && (
        <Styled.List $inline={inline} as={links.length > 1 ? "ul" : "div"}>
          {links.map(callout => (
            <LinkTag>
              <Callout
                showErrors={showErrors}
                key={callout.id}
                callout={callout}
                darkMode={darkMode}
                track={track}
                isLink
              />
            </LinkTag>
          ))}
        </Styled.List>
      )}
    </Styled.Wrapper>
  );
}

HeroCalloutList.displayName = "Frontend.Entity.Hero.Parts.CalloutList";

HeroCalloutList.propTypes = {
  callouts: PropTypes.array.isRequired,
  authorized: PropTypes.bool,
  showErrors: PropTypes.bool,
  inline: PropTypes.bool,
  mobileVisible: PropTypes.bool,
  darkMode: PropTypes.bool,
  buttonSize: PropTypes.oneOf(["sm", "lg"]),
  track: PropTypes.func
};
