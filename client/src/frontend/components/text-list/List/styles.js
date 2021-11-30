import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { panelRounded, listUnstyled, fluidScale } from "theme/styles/mixins";

const DEFAULT_BORDER_COLOR = "var(--color-neutral-ui-dull-dark)";

export const Category = styled.div`
  &:not(:last-child) {
    --List-last-child-border-color: transparent;
  }
`;

export const CategoryHeading = styled.h3`
  ${panelRounded}
  padding: 0.857em 1.643em 1em;
  margin-top: 0;
  margin-bottom: 0;
  font-size: ${fluidScale("14px", "13px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semibold);
  color: var(--strong-color);
  text-transform: uppercase;
  letter-spacing: 0.107em;
  background-color: var(--box-medium-bg-color);
`;

export const List = styled("ul", transientOptions)`
  ${listUnstyled}
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--List-border-color, transparent);

  ${({ $noLabel }) =>
    $noLabel && `--List-border-color: ${DEFAULT_BORDER_COLOR};`}

  > li {
    padding: 30px 0;
    border-bottom: 1px solid ${DEFAULT_BORDER_COLOR};

    &:last-child {
      border-bottom-color: var(
        --List-last-child-border-color,
        ${DEFAULT_BORDER_COLOR}
      );
    }
  }
`;
