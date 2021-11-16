import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const SIZES = { retina: 2560, large: 1280, medium: 640 };

export default function HeroImage({ image }) {
  return (
    <Styled.Wrapper aria-hidden>
      <Styled.Image
        srcSet={`
          ${image.largeLandscape} ${SIZES.large}w,
          ${image.mediumLandscape} ${SIZES.medium}w
        `}
        src={image.largeLandscape}
        alt=""
      />
    </Styled.Wrapper>
  );
}

HeroImage.propTypes = {
  image: PropTypes.object.isRequired
};
