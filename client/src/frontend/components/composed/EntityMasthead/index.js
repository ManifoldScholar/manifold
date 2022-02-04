import React from "react";
import PropTypes from "prop-types";
import { breakpoints } from "theme/styles/variables/media";
import * as Styled from "./styles";

function getImage(entity) {
  const { heroStyles } = entity.attributes ?? {};
  const { heroStyles: journalHero } =
    entity.relationships?.journal?.attributes ?? {};
  if (heroStyles?.largeLandscape && heroStyles?.mediumLandscape)
    return heroStyles;
  if (journalHero?.largeLandscape && journalHero?.mediumLandscape)
    return journalHero;
  return null;
}

export default function Masthead({ entity }) {
  if (!entity) return null;
  const image = getImage(entity);
  const logo = entity.relationships?.journal?.attributes ?? null;
  const color = entity.relationships?.journal?.attributes ?? "#B4A075";

  if (!image && !logo) return null;

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
