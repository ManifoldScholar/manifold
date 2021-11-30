import React from "react";
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
  lightMode = true
}) {
  const visible = authorized
    ? callouts
    : callouts.filter(
        callout =>
          callout.attributes.visibility === "always" ||
          callout.attributes.visibility === "unauthorized"
      );
  const [buttons, links] = partition(visible, "attributes.button");

  return (
    <Styled.Wrapper $mobile={mobileVisible}>
      {buttons.length > 0 && (
        <Styled.List $inline={inline}>
          {buttons.map(callout => (
            <Callout
              showErrors={showErrors}
              key={callout.id}
              callout={callout}
              lightMode={lightMode}
            />
          ))}
        </Styled.List>
      )}
      {links.length > 0 && (
        <Styled.List $inline={inline}>
          {links.map(callout => (
            <Callout
              showErrors={showErrors}
              key={callout.id}
              callout={callout}
              lightMode={lightMode}
              link
            />
          ))}
        </Styled.List>
      )}
    </Styled.Wrapper>
  );
}

HeroCalloutList.propTypes = {
  callouts: PropTypes.array.isRequired,
  authorized: PropTypes.bool,
  showErrors: PropTypes.bool,
  inline: PropTypes.bool,
  mobileVisible: PropTypes.bool,
  lightMode: PropTypes.bool
};
