import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import {
  respond,
  fluidScale,
  transparentize,
  defaultTransitionProps
} from "theme/styles/mixins";

export const Wrapper = styled("article", transientOptions)`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: var(--Thumbnail-width, 100%);
  height: var(--Thumbnail-height);
  text-align: var(--Thumbnail-text-align, center);
  color: var(--Thumbnail-color);
  background-color: var(--Thumbnail-background-color, var(--box-medium-bg-color));
  border-radius: var(--Thumbnail-border-radius);
  box-shadow: var(--Thumbnail-box-shadow);
  transition: color ${defaultTransitionProps},
    box-shadow ${defaultTransitionProps};

  ${({ $hasBgImage, $minimal, $iconOnly }) =>
    $hasBgImage &&
    `
    ${$iconOnly ? `--Thumbnail-Icon-display: none;` : ``}

    --Thumbnail-before-opacity: ${$minimal ? 0 : 1};
    --Thumbnail-before-background-color: ${
      $minimal ? "var(--hover-color)" : transparentize("neutral90", 0.3)
    };
    --Thumbnail-before-display: ${$iconOnly ? "none" : "block"};

    color: var(--Thumbnail-color, var(--color-base-neutral-white));
    background-position: 0 0;
    background-size: cover;
  `}

  ${({ $showTitle, $minimal }) =>
    $showTitle &&
    `
    ${!$minimal ? `--Thumbnail-Inner-padding: 16px 16px 18px;` : ``}
    --Thumbnail-Figure-font-size: 12px;
    --Thumbnail-Icon-size: ${fluidScale("64px", "48px")};
    --Thumbnail-Icon-padding: ${fluidScale("14px", "10px")} 0;

    ${
      !$minimal
        ? respond(`--Thumbnail-Inner-padding: 22px 20px 36px;`, 120)
        : ``
    }
  `}

  ${({ $alignEnd }) => ($alignEnd ? `--Thumbnail-text-align: end;` : ``)}

  ${({ $minimal, $hasBgImage, $isPreview }) =>
    $minimal &&
    `
    ${
      !$isPreview
        ? `--Thumbnail-background-color: transparent;`
        : `
        --Thumbnail-width: 37px;
        --Thumbnail-height: 37px;
      `
    }
    --Thumbnail-Inner-padding: 0 0 0.5em 0;
    --Thumbnail-Title-padding-block-start: 8px;
    --Thumbnail-Title-font-size: 14px;
    --Thumbnail-Title-font-weight: var(--font-weight-light);
    --Thumbnail-Icon-width: ${$isPreview ? "100%" : "80px"};
    --Thumbnail-Icon-height: ${$isPreview ? "37px" : "50px"};
    --Thumbnail-Icon-size: ${$isPreview ? "24px" : "30px"};
    --Thumbnail-Icon-display: ${$hasBgImage ? "none" : "flex"};
    --Thumbnail-Icon-margin: 0 0 0 auto;
    --Thumbnail-Icon-padding: 0;
    --Thumbnail-Icon-color: var(--strong-color);
  `}

  ${({ $iconOnly, $hasBgImage }) =>
    $iconOnly &&
    `
    --Thumbnail-Inner-padding: ${$hasBgImage ? "50px 0 0" : 0};
    --Thumbnail-Icon-width: 100%;
    --Thumbnail-Icon-padding: 5px;
  `}

  &::before {
    opacity: var(--Thumbnail-before-opacity, 0);
    position: absolute;
    width: 100%;
    height: 100%;
    content: "";
    display: var(--Thumbnail-before-display, none);
    background-color: var(--Thumbnail-before-background-color, ${transparentize(
      "neutral90",
      0.3
    )});
    border-radius: var(--Thumbnail-border-radius);
    transition: background-color ${defaultTransitionProps};
  }
`;

export const Inner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(
    --Thumbnail-Inner-padding,
    ${fluidScale("35px", "24px")} 0 ${fluidScale("43px", "30px")}
  );
`;

export const Figure = styled.figure`
  font-size: var(--Thumbnail-Figure-font-size, 13px);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semibold);
  text-align: var(--Thumbnail-text-align);
  text-transform: uppercase;
  letter-spacing: 0.096em;

  .notation-viewer & {
    font-size: 0;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background-color: var(--hover-color);
  opacity: var(--Thumbnail-ImageOverlay-opacity, 0);
  transition: opacity var(--transition-duration-default) ease-out;
`;

export const Image = styled.img`
  display: block;
  width: auto;
  height: 50px;
`;

export const Title = styled.h4`
  opacity: var(--Thumbnail-Title-opacity);
  width: var(--Thumbnail-Title-width);
  padding-block-start: var(--Thumbnail-Title-padding-block-start, 0);
  margin: 0;
  font-size: var(--Thumbnail-Title-font-size, 17px);
  font-family: var(--font-family-sans);
  font-weight: var(--Thumbnail-Title-font-weight, var(--font-weight-medium));
  hyphens: none;
  transition: opacity ${defaultTransitionProps};
`;
