import React from "react";
import PropTypes from "prop-types";
import { breakpoints } from "theme/styles/variables/media";
import * as Styled from "./styles";

const SIZES = { retina: 2560, large: 1280, medium: 640 };
const BREAKPOINT = breakpoints[60];

export default function HeroImage({ image, alt }) {
  return (
    <Styled.Wrapper aria-hidden>
      <Styled.Image
        srcSet={`
          ${image.largeLandscape} ${SIZES.large}w,
          ${image.mediumLandscape} ${SIZES.medium}w
        `}
        sizes={`(max-width: ${BREAKPOINT}) ${SIZES.medium}px, (max-width: ${breakpoints[120]}) ${SIZES.large}px`}
        src={image.largeLandscape}
        alt={alt ?? ""}
      />
    </Styled.Wrapper>
  );
}

HeroImage.displayName = "Frontend.Entity.Hero.Parts.Image";

HeroImage.propTypes = {
  image: PropTypes.object.isRequired
};
