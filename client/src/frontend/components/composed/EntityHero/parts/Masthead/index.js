import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const SIZES = { retina: 2560, large: 1280, medium: 640 };

export default function Masthead({ image, logo, color }) {
  return (
    <Styled.Wrapper $color={color}>
      {image && (
        <Styled.Image
          srcSet={`
          ${image.largeLandscape} ${SIZES.large}w,
          ${image.mediumLandscape} ${SIZES.medium}w
        `}
          src={image.largeLandscape}
          alt=""
        />
      )}
      {logo && (
        <Styled.Logo
          srcSet={`
        ${logo.large} ${SIZES.large}w,
        ${logo.medium} ${SIZES.medium}w
      `}
          src={logo.large}
          alt=""
          height={"225px"}
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
