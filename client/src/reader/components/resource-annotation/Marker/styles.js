import styled from "@emotion/styled";
import { respond, buttonUnstyled } from "theme/styles/mixins";
import { readerContainerWidths } from "theme/styles/utility/layout";

export const Wrapper = styled.span`
  position: relative;
`;

export const Marker = styled.button`
  ${buttonUnstyled};
  height: 28px;
  width: 28px;
  padding: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: var(--color-base-neutral10);
  color: var(--color-base-neutral75);
  cursor: pointer;
  margin-inline: 8px;
  transform: scale(calc(100% - (3 - var(--reader-font-size-index)) * 5%))
    translateY(calc(2px + (3 - var(--reader-font-size-index)) * 1px));

  .scheme-dark & {
    background-color: var(--color-base-neutral100);
    color: var(--color-base-neutral50);

    ${({ $active }) =>
      $active &&
      `
        background-color: var(--color-accent-primary);
        color: var(--color-base-neutral90);
      `}
  }

  ${({ $active }) =>
    $active &&
    `
      background-color: var(--color-accent-primary);
      color: var(--color-base-neutral90);
    `}

  ${({ $static }) => $static && `pointer-events: none; cursor: default;`}
`;

const paddings = readerContainerWidths
  .map(
    (width, i) => `
  .container-width-${i} & {
    padding-inline: calc((((100vw - ${width}) / 2) - 200px) / 2);
  }
`
  )
  .join("");

const unselectable = `
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const Sidebar = styled.div`
  display: none;
  position: absolute;
  left: ${({ $left }) => ($left ? `-${$left}px` : 0)};
  top: -50%;

  ${paddings}

  .container-width-1 & {
    ${respond(`display: block;`, "1360px")}
  }

  .container-width-2 & {
    ${respond(`display: block;`, "1240px")}
  }

  ${({ $hidden }) => $hidden && `z-index: -1; height: 0; overflow: hidden;`}

  ${({ $right }) =>
    $right && `left: auto; right: calc((100vw - ${$right}px) * -1);`}

    ${unselectable}
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-block-start: ${({ $count }) => `calc(-1 * ${$count} * 10px)`};
`;
