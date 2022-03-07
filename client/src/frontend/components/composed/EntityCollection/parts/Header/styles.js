import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { transientOptions } from "helpers/emotionHelpers";
import {
  fluidScale,
  respond,
  linkUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";
import { containerWidth } from "theme/styles/variables/layout";
import TitleLinkComponent from "./TitleLink";

export const IMAGE_MAX_HEIGHT = "340px";
const GAP = "30px";

function getGridTemplateAreas({ $layout }) {
  switch ($layout) {
    case "full_bleed":
      return `
        "image"
        "title"
        "description"
      `;
    case "wide_inset":
    case "square_inset":
      return `
        "title"
        "image"
        "description"
      `;
    case "title_description":
      return `
        "title"
        "description"
      `;
    case "title_description_image":
      return `
        "title"
        "description"
        "image"
      `;
    case "title_image":
      return `
        "title"
        "image"
      `;
    default:
      return `
        "title"
      `;
  }
}

function getImageStyles({ $layout }) {
  switch ($layout) {
    case "full_bleed":
      return `
        position: relative;
        inset-inline: 50%;
        inline-size: 100vw;
        max-width: none;
        margin-block-start: -60px;
        margin-inline: -50vw;

        ${respond(
          `
            position: static;
            margin-inline: calc(-100vw / 2 + ${containerWidth.inner} / 2);
          `,
          120
        )}
      `;
    case "wide_inset":
      return `
        inline-size: 100%;
      `;
    default:
      // "square_inset"
      return `
        inline-size: ${IMAGE_MAX_HEIGHT};
      `;
  }
}

export const Header = styled("header", transientOptions)`
  flex-grow: 999;
  flex-basis: ${({ $width }) => $width};
  display: grid;
  grid-template-areas: ${getGridTemplateAreas};
  grid-template-columns: 100%;
  align-items: flex-start;
  grid-gap: ${GAP};
  font-family: var(--font-family-heading);

  ${({ $layout }) =>
    $layout === "square_inset" &&
    respond(
      `
        grid-template-areas:
          "image title"
          "image description";
        grid-template-rows: auto 1fr;
        grid-template-columns: ${IMAGE_MAX_HEIGHT} auto;
      `,
      75
    )}
`;

export const TitleAndIcon = styled.div`
  grid-area: title;
  display: flex;
  align-items: flex-start;
  gap: ${fluidScale("12px", "9px")};
`;

const iconStyles = `
  flex-shrink: 0;
  inline-size: ${fluidScale("60px", "56px")};
  block-size: ${fluidScale("60px", "56px")};
  color: var(--EntityCollection-Header-Icon-color, var(--weak-color));
`;

export const Icon = styled(IconComposer)`
  ${iconStyles}
`;

export const IconComponent = styled.svg`
  ${iconStyles}
`;

export const TitleLink = styled(TitleLinkComponent)`
  ${linkUnstyled}

  &:hover {
    --strong-color: var(--hover-color);
  }

  ${Icon} + &,
  ${IconComponent} + & {
    transform: translateY(${fluidScale("12px", "14px")});
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--strong-color);
  font-size: ${fluidScale("26px", "18px")};
  font-weight: var(--font-weight-medium);
  transition: color ${defaultTransitionProps};

  ${Icon} + &,
  ${IconComponent} + & {
    transform: translateY(${fluidScale("12px", "14px")});
  }
`;

export const ToggleWrapper = styled.span`
  ${Icon} ~ &,
  ${IconComponent} ~ & {
    transform: translateY(10px);

    ${respond(`transform: translateY(14px)`, 80)}
  }
`;

export const Description = styled.div`
  max-width: 560px;
  grid-area: description;
  line-height: 1.5;

  p + p {
    margin-block-start: 1em;
  }
`;

export const Image = styled.img`
  grid-area: image;
  height: ${IMAGE_MAX_HEIGHT};
  object-fit: cover;
  object-position: center;
  ${getImageStyles}
`;

export const ImageComponent = styled.div`
  grid-area: image;
`;
