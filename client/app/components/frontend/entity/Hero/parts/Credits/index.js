import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function HeroCredits({ copy }) {
  return (
    <Styled.Wrapper>
      <Styled.Text dangerouslySetInnerHTML={{ __html: copy }} />
    </Styled.Wrapper>
  );
}

HeroCredits.displayName = "Frontend.Entity.Hero.Parts.Credits";

HeroCredits.propTypes = {
  copy: PropTypes.string.isRequired
};
