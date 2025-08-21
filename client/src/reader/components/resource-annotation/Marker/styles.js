import styled from "@emotion/styled";
import { respond, buttonUnstyled } from "theme/styles/mixins";

export const thumbnailBreakpoints = [
  "1460px",
  "1340px",
  "1205px",
  "1095px",
  "925px"
];

export const mediaQueries = display =>
  thumbnailBreakpoints
    .map(
      (width, i) => `
  .container-width-${i} & {
    ${respond(`display: ${display};`, width)}
  }
`
    )
    .join("");

export const Wrapper = styled.span`
  position: relative;
`;

export const Marker = styled.button`
  ${buttonUnstyled};
  height: 28px;
  width: 28px;
  padding: 4px;
  display: none;
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

  ${mediaQueries("inline-flex")}
`;

export const MarkerMobile = styled(Marker)`
  display: inline-flex;

  &[data-hover-override="true"],
  section:not(:has(*[data-hover-override="true"])) &[data-active="true"] {
    background-color: var(--color-accent-primary);
    color: var(--color-base-neutral90);
  }

  ${mediaQueries("none")}
`;
