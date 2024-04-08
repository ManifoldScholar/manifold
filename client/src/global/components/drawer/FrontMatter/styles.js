import styled from "@emotion/styled";
import {
  buttonUnstyled,
  utilityPrimary,
  defaultHoverStyle,
  respond,
  drawerPadding,
  headingQuaternary
} from "theme/styles/mixins";
import Utility from "global/components/utility";

const CLOSE_ICON_SIZE = "24px";

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 18px;

  ${respond(`padding-bottom: 26px;`, 50)}

  ${({ $padLateral }) =>
    $padLateral &&
    `
    padding-right: 20px;
    padding-left: 20px;

    ${respond(
      `
        padding-right: 32px;
        padding-left: 32px;
      `,
      65
    )}
  `}

  ${({ $padBottom }) =>
    $padBottom &&
    `padding-block-end: 50px;
    ${respond(`padding-bottom: 50px;`, 50)}`}
`;

export const BarReader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 10px;
  padding-bottom: 12px;
  color: var(--strong-color);
  background-color: var(--box-medium-bg-color);

  ${drawerPadding("padding-right", "narrow")}
  ${drawerPadding("padding-left", "narrow")}
`;

export const Title = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  min-height: 24px;
`;

export const TitleText = styled.h2`
  ${utilityPrimary}
  font-size: 13px;
  letter-spacing: 0.125em;
  margin: 0;
`;

export const TitleIcon = styled(Utility.IconComposer)`
  position: relative;
  top: 2px;
  margin-right: 10px;
`;

export const CloseButton = styled.button`
  ${buttonUnstyled}
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 17px;
  cursor: pointer;

  ${({ $primary }) =>
    $primary &&
    `
    cursor: pointer;

    &:hover {
      ${defaultHoverStyle}
      outline: 0;
    }

    &:focus-visible {
      color: var(--focus-color);
    }
  `}
`;

export const CloseText = styled.span`
  ${utilityPrimary}
  margin-right: 10px;
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  line-height: ${CLOSE_ICON_SIZE};
  letter-spacing: 0.125em;
`;

export const CloseIcon = styled(Utility.IconComposer)`
  width: ${CLOSE_ICON_SIZE};
  height: ${CLOSE_ICON_SIZE};
`;

export const FullScreenTitle = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-right: auto;
`;

export const FullScreenTitleText = styled.h1`
  ${headingQuaternary}
  font-weight: var(--font-weight-semibold);
`;

export const FullScreenTitleIcon = styled(Utility.IconComposer)`
  position: relative;
  top: 2px;
  color: var(--color-accent-primary);
`;
