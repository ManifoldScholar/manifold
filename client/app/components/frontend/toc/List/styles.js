import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { respond, listUnstyled, fluidScale } from "theme/styles/mixins";

const firstLevelPadding = "1em";
const nestedLevelPadding = "1.611em";
const borderColor = "var(--color-base-neutral40)";
const borderStyle = `1px solid ${borderColor}`;

export const Block = styled.div`
  --link-indent: ${firstLevelPadding};

  font-family: var(--font-family-heading);
  line-height: 1.278;
  color: var(--color-base-neutral90);
`;

export const Heading = styled.h3`
  padding-top: 20px;
  padding-bottom: 22px;
  margin-top: 0;
  margin-bottom: 0;
  border-top: 1px solid ${borderColor};
`;

export const TextTitle = styled.span`
  padding-right: 0.636em;
  font-size: ${fluidScale("22px", "19px")};
  font-weight: var(--font-weight-medium);
`;

export const TextSubtitle = styled.span`
  display: inline-block;
  font-size: ${fluidScale("20px", "17px")};
  font-family: var(--font-family-copy);
  font-style: italic;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.017em;
`;

export const List = styled("ul", transientOptions)`
  ${listUnstyled}
  display: flex;
  flex-direction: column;
  font-size: ${fluidScale("18px", "16px")};

  ${({ $depth }) => `
    --link-indent: calc(${firstLevelPadding} + ${nestedLevelPadding} * ${$depth -
    1});

    ${$depth === 1 &&
      `
      padding-top: 20px;
      padding-bottom: 20px;
      border-top: ${borderStyle};
      border-bottom: ${borderStyle};
      border-bottom-color: var(--List-last-child-border-color, ${borderColor});
    `}
  `}

  ${({ $large }) =>
    $large &&
    `
      gap: min(1.25vw, 10px);
      padding-top: min(3.75vw, 30px);
      padding-bottom: min(3.75vw, 30px);
      font-weight: var(--font-weight-medium);

      ${respond(`font-size: 20px;`, 80)}
  `}
`;
