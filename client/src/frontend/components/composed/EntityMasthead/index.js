import React from "react";
import PropTypes from "prop-types";
import { breakpoints } from "theme/styles/variables/media";
import * as Styled from "./styles";

const SIZES = { retina: 2560, large: 1280, medium: 640 };
const BREAKPOINT = breakpoints[60];

// TODO: update once API is in place
function getImage(entity) {
  const { heroStyles } = entity.attributes;
  if (!heroStyles?.largeLandscape || !heroStyles?.mediumLandscape) return null;
  return heroStyles;
}

// TODO: update once API is in place
function getLogo(entity) {
  return {
    large: "/static/images/aleph-logo.png",
    medium: "/static/images/aleph-logo.png"
  };
  const { logoStyles } = entity.attributes;
  if (!logoStyles?.large || !logoStyles?.medium) return null;
  return logoStyles;
}

export default function Masthead({ entity }) {
  const image = getImage(entity);
  const logo = getLogo(entity);
  const color = entity.attributes.mastheadColor || "#B4A075";

  if (!image && !logo) return null;

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

Masthead.displayName = "Frontend.Composed.EntityMasthead";

Masthead.propTypes = {
  entity: PropTypes.object.isRequired
};
