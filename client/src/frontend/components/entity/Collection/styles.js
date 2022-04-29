import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { fluidScale } from "theme/styles/mixins";

const GAP = "20px";

export const Wrapper = styled("section", transientOptions)`
  --Box-padding-inline: 0;

  overflow: ${({ $nested, $boxed }) =>
    $nested || $boxed ? "visible" : "hidden"};

  .bg-white + &.bg-white > .container,
  .bg-neutral05 + &.bg-neutral05 > .container {
    padding-block-start: 0;
  }

  ${({ $nested, $boxed }) =>
    ($nested || $boxed) &&
    `
    --EntityCollection-Header-Icon-color: var(--color);
    --content-color: var(--color);
    --card-bg-color: var(--color-base-neutral-white);

    &:first-child {
      margin-block-start: 30px;
    }

    & + & {
      margin-block-start: ${fluidScale("55px", "25px")};
    }
  `}

  /* TODO: move to component style */
  .icon-star-fill--header {
    width: 48px;
    height: 48px;
    fill: transparent;

    .icon-star-fill__foreground {
      fill: var(--color-neutral-text-extra-dark);
    }

    .icon-star-fill__background {
      fill: var(--color-base-blue45);
    }

    + h2 {
      transform: translateY(${fluidScale("7px", "10px")});
    }
  }
`;

export const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${GAP};
`;

export const CountWrapper = styled("div", transientOptions)`
  flex-basis: 100%;
  margin-block-start: ${GAP};

  ${({ $hasHeader }) =>
    !$hasHeader &&
    `
    order: -1;
    flex-basis: auto;
    flex-grow: 999;
    align-self: center;
    margin-block-start: 0;
  `}
`;

export const BodyWrapper = styled.div`
  flex-basis: 100%;
  margin-block-start: ${GAP};

  ${CountWrapper} + & {
    margin-block-start: 0;
  }
`;

export const PaginationWrapper = styled.div`
  flex-basis: 100%;
  margin-block-start: 25px;
`;

export const FooterWrapper = styled.div``;
