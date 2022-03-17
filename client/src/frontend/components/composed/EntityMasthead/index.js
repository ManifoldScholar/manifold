import React from "react";
import PropTypes from "prop-types";
import { breakpoints } from "theme/styles/variables/media";
import * as Styled from "./styles";

const checkSizes = (image, parentImage, lg, med) => {
  if (image && image[lg] && image[med]) return image;
  if (parentImage && parentImage[lg] && parentImage[med]) return parentImage;
  return null;
};

const getContent = (entity, parent) => {
  const { heroBackgroundColor, heroStyles, logoStyles } =
    entity.attributes ?? {};
  const {
    heroBackgroundColor: parentColor,
    heroStyles: parentHero,
    logoStyles: parentLogo
  } = parent?.attributes ?? {};

  const color = heroBackgroundColor ?? parentColor ?? null;
  const logo =
    (!parent || (parent && !heroStyles.largeLandscape)) &&
    checkSizes(logoStyles, parentLogo, "original", "medium");
  const image = checkSizes(
    heroStyles,
    parentHero,
    "largeLandscape",
    "mediumLandscape"
  );

  return { image, logo, color };
};

export default function Masthead({ entity }) {
  if (!entity) return null;
  const { image, logo, color } = getContent(
    entity,
    entity.relationships?.journal
  );

  if (!image && !logo && !color) return null;

  return (
    <Styled.Wrapper $color={color}>
      {image && (
        <Styled.Image
          srcSet={`
          ${image.largeLandscape} 1280w,
          ${image.mediumLandscape} 640w
        `}
          sizes={`(max-width: ${breakpoints[60]}) 640px, (max-width: ${breakpoints[120]}) 1280px`}
          src={image.largeLandscape}
          alt=""
          loading="lazy"
        />
      )}
      {logo && (
        <Styled.LogoWrapper>
          <Styled.Logo
            srcSet={`
            ${logo.original} 2x,
            ${logo.medium} 1x
          `}
            src={logo.original}
            alt=""
            loading="lazy"
          />
        </Styled.LogoWrapper>
      )}
    </Styled.Wrapper>
  );
}

Masthead.displayName = "Frontend.Composed.EntityMasthead";

Masthead.propTypes = {
  entity: PropTypes.object.isRequired
};
