import React from "react";
import PropTypes from "prop-types";
import { breakpoints } from "theme/styles/variables/media";
import * as Styled from "./styles";

const SIZES = { retina: 2560, large: 1280, medium: 640 };
const BREAKPOINT = breakpoints[60];

export default function Masthead({ image, logo, color }) {
  return (
    <Styled.Wrapper $color={color}>
      {image && (
        <Styled.Image
          srcSet={`
          ${image.largeLandscape} ${SIZES.large}w,
          ${image.mediumLandscape} ${SIZES.medium}w
        `}
          sizes={`(max-width: ${BREAKPOINT}) ${SIZES.medium}px, (max-width: ${breakpoints[120]}) ${SIZES.large}px`}
          src={image.largeLandscape}
          alt=""
        />
      )}
      {logo && (
        <Styled.Logo
          srcSet={`
        ${logo.large} 2x,
        ${logo.medium} 1x
      `}
          src={logo.large}
          alt=""
        />
      )}
    </Styled.Wrapper>
  );
}

Masthead.displayName = "Frontend.Composed.EntityHero.Parts.Masthead";

Masthead.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  color: PropTypes.string,
  logo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
