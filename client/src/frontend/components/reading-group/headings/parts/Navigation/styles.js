import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import {
  respond,
  utilityPrimary,
  defaultTransitionProps
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const linkLateralPadding = "12px";
const count2Breakpoint = "600px";
const count3Breakpoint = "800px";

function setResponsiveLayout(count) {
  const breakpoint = count === 2 ? count2Breakpoint : count3Breakpoint;
  return `
    > :first-child {
      border-top-left-radius: var(--box-border-radius);
      border-top-right-radius: var(--box-border-radius);

      ${respond(
        `border-top-right-radius: 0;
      border-bottom-left-radius: var(--box-border-radius);`,
        breakpoint
      )}
    }

    > :last-child {
      border-bottom-right-radius: var(--box-border-radius);
      border-bottom-left-radius: var(--box-border-radius);

      ${respond(
        `border-top-right-radius: var(--box-border-radius);
      border-bottom-left-radius: 0;`,
        breakpoint
      )}
    }
  `;
}

const getDesktopLayout = (count, layout) => {
  if (count === 2) {
    return layout === "grid"
      ? `${respond(
          `grid-template-columns: repeat(2, minmax(0, 1fr));`,
          count2Breakpoint
        )}`
      : `width: 100%;

    ${respond(
      `display: flex;
    width: auto;`,
      count2Breakpoint
    )}`;
  }
  return layout === "grid"
    ? `${respond(
        `grid-template-columns: repeat(3, minmax(0, 1fr));`,
        count3Breakpoint
      )}`
    : `${respond(`display: flex;`, count3Breakpoint)}`;
};

export const ChildNav = styled("nav", transientOptions)`
  ${utilityPrimary}
  display: grid;
  grid-template-columns: 1fr;
  font-size: 15px;
  color: var(--color-base-neutral80);

  ${({ $count }) => setResponsiveLayout($count)}

  ${({ $layout }) =>
    $layout === "flex" &&
    `
    > * {
    flex-grow: 1;
    }
  `}

  ${({ $count, $layout }) => getDesktopLayout($count, $layout)}
`;

export const Link = styled(NavLink, transientOptions)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px ${linkLateralPadding};
  text-decoration: none;
  background-color: var(--box-bg-color);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  ${({ $padded }) =>
    $padded &&
    `
    padding-right: min(5vw, 50px);
    padding-left: min(5vw, 50px);
    `}

  &.focus-visible,
  &:hover {
    --box-bg-color: var(--color-base-neutral20);
    color: var(--strong-color);

    outline: none;
  }
`;

export const LinkText = styled.span`
  margin-left: 9px;
  transform: translateY(-1px);
`;
