import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { transientOptions } from "helpers/emotionHelpers";
import {
  respond,
  fluidScale,
  defaultTransitionProps,
  utilityPrimary,
  listUnstyled
} from "theme/styles/mixins";

export const Block = styled("div", transientOptions)`
  display: flex;
  flex-direction: column;

  ${respond(`flex-direction: row;`, 60)}

  ${({ $loading }) =>
    $loading &&
    `
    --strong-color: var(--color-base-neutral30);

      svg {
        color: var(--color-base-neutral40);
      }
  `}
`;

export const Content = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 0;
  color: inherit;
  text-decoration: none;
`;

export const Inner = styled.div`
  display: flex;
  width: 100%;
  padding: 0;
`;

export const Bibliographic = styled.div`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  width: 100%;
  padding-right: 20px;
  padding-left: 15px;
  hyphens: none;
  vertical-align: top;
`;

export const Name = styled.h4`
  display: flex;
  margin: 0;
  font-size: ${fluidScale("21px", "16px")};
  font-weight: var(--font-weight-semibold);
  line-height: 1.188;
  color: var(--strong-color);
  white-space: normal;
  transition: color ${defaultTransitionProps};
`;

export const TitleLink = styled(Link)`
  text-decoration: none;
`;

export const Title = styled.span`
  display: inline-block;
  margin-right: 12px;
  font-family: var(--font-family-heading);
`;

const metadataStyles = `
  font-family: var(--font-family-copy);
  display: block;
  padding-top: 6px;
  font-size: ${fluidScale("18px", "15px")};
`;

export const Subtitle = styled.span`
  ${metadataStyles}
  margin-right: 12px;
  font-style: italic;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.031em;
  transition: color ${defaultTransitionProps};

  ${respond(
    `display: inline-block;
    padding-top: 0.143em;`,
    80
  )}
`;

export const Creators = styled.div`
  ${metadataStyles}
  line-height: 1.25;
  color: var(--color-neutral-text-extra-dark);

  ${respond(`padding-top: 0.6em;`, 80)}
`;

export const CollectingToggle = styled("span", transientOptions)`
  flex-grow: 1;
  transform: translateY(-0.238em);

  ${({ $hasSubtitle }) => $hasSubtitle && `transform: translateY(-0.19em);`}
`;

export const Description = styled.div`
  max-width: 635px;
  margin-top: 15px;
  font-size: 16px;
  font-family: var(--font-family-copy);
  line-height: 1.438;
  letter-spacing: 0.013em;
`;

export const Status = styled("div", transientOptions)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > :not(:first-child) {
    margin-top: 12px;
  }

  ${({ $block }) =>
    $block
      ? `margin-top: 12px;`
      : respond(
          `flex-direction: row;
          align-items: baseline;
          justify-content: flex-end;

            > :not(:first-child) {
              margin-top: 0;
              margin-left: 12px;
            }
          `,
          60
        )}
`;

export const Published = styled.span`
  display: inline-block;
  padding: 4px 7px 6px;
  font-size: ${fluidScale("13px", "12px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  color: var(--strong-color);
  text-transform: uppercase;
  letter-spacing: 0.134em;
  vertical-align: middle;
  background-color: var(--color-accent-primary);
  border-radius: 3px;
`;

export const Meta = styled.div`
  flex-shrink: 0;
  min-width: 288px;
  padding-right: 20px;
  padding-left: 15px;
  margin-top: 20px;

  ${respond(
    `
      padding-right: 0;
      padding-left: 0;
      margin-top: 4px;
      text-align: right;
    `,
    60
  )}
`;

export const Date = styled.div`
  ${utilityPrimary}
  display: block;
  font-size: ${fluidScale("14px", "12px")};
  letter-spacing: 0.107em;
`;

export const InteractionList = styled.ul`
  ${listUnstyled}
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:first-child) {
    padding-top: 15px;
  }

  ${respond(`justify-content: flex-end;`, 60)}
`;

export const Interaction = styled.li`
  ${utilityPrimary}
  font-size: 14px;
  letter-spacing: 0.107em;
  border-bottom: none;

  & + & {
    margin-left: 13px;
  }

  svg {
    margin-right: 6px;
  }
`;

export const InteractionLabel = styled.span`
  color: var(--strong-color);
`;
