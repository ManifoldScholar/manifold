import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { readerContainerWidths } from "theme/styles/utility/layout";
import { thumbnailBreakpoints } from "../../styles";
import { unselectable } from "../../Sidebar/styles";
import IconComposer from "global/components/utility/IconComposer";
import Button from "global/components/atomic/Button";

const mediaQueries = thumbnailBreakpoints
  .map(
    (width, i) => `
  .container-width-${i} & {
    ${respond(`display: none;`, width)}
  }
`
  )
  .join("");

export const contentMaxWidth = readerContainerWidths
  .map(
    (width, index) => `
    .container-width-${index} & {
      max-inline-size: ${width};
    }
  `
  )
  .join("");

export const Wrapper = styled.span`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: var(--background-color);
  z-index: 100;

  &:not([data-hover-override="true"])::before {
    content: "";
    position: absolute;
    inset: -20px;
    height: 20px;
    background: linear-gradient(rgba(0, 0, 0, 0) 0%, #000 100%);
    opacity: 0.1;
    z-index: -1;

    .scheme-dark & {
      opacity: 0.3;
    }
  }

  &[data-hover-override="true"] {
    z-index: 101;
  }

  ${mediaQueries}
  ${unselectable}
`;

export const Content = styled.span`
  margin-inline: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  padding: 16px;
  padding-block-end: 18px;

  ${contentMaxWidth};
`;

export const ImageWrapper = styled.span`
  display: block;
  width: 70px;
  height: 47px;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: var(--box-medium-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

export const Title = styled.span`
  font-size: clamp(13px, 2.9vw, 16px);
  line-height: 17px;
  font-weight: 400;
  text-align: left;
  margin-block: 0;
  font-family: var(--font-family-sans);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-grow: 1;
  align-self: stretch;
`;

export const ViewButton = styled(Button)`
  flex-shrink: 0;

  &::after {
    content: "";
    display: block;
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
  }
`;

export const Icon = styled(IconComposer)`
  height: 32px;
  width: 32px;
  color: var(--color);
`;
