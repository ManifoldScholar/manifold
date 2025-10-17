import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins";
import { defaultTransitionProps } from "theme/styles/mixins";

export const Label = styled.span`
  background-color: var(--button-bg-color);
  padding-block: 0.25rem;
  padding-inline: 0.75rem;
  ${utilityPrimary}
  font-size: 11px;
  display: flex;
  gap: 0.25rem;
  justify-content: flex-start;
  align-items: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-top: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
  border-color: var(--color-base-neutral40);
  border-color: light-dark(
    var(--color-base-neutral40),
    var(--color-base-neutral75)
  );
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};
`;

export const Content = styled.span`
  display: block;
  padding: 0.75rem;
  color: var(--strong-color);
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
  border-color: var(--color-base-neutral40);
  border-color: light-dark(
    var(--color-base-neutral40),
    var(--color-base-neutral75)
  );
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};

  > * + * {
    padding-block-start: 10px;
  }
`;

const baseWrapperStyles = `
width: 200px;
border-radius: 6px;
text-indent: 0;
color: var(--color-base-neutral75);
opacity: 0;
display: block;
`;

export const PositionerWrapper = styled.span`
  ${baseWrapperStyles}
  pointer-events: none;
`;

export const Wrapper = styled.span`
  ${baseWrapperStyles}
  color: var(--color);
  cursor: pointer;
  transform: translateX(-50px);
  transition: opacity ${defaultTransitionProps},
    transform ${defaultTransitionProps}, box-shadow ${defaultTransitionProps},
    color ${defaultTransitionProps};

  ${({ $visible }) => $visible && `opacity: 1; transform: translateX(0);`}

  ${({ $active }) =>
    $active &&
    `
    color: var(--color-base-neutral90);
    box-shadow: 0 8px 35.8px -6px rgba(0, 0, 0, 0.3);
    box-shadow: 0 8px 35.8px -6px light-dark(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));

    ${Label} {
      background-color: var(--color-accent-primary);
      border-color: var(--color-accent-primary);
    }

    ${Content} {
      border-color: transparent;
    }
  `}
`;

export const ImageWrapper = styled.span`
  display: block;
  width: 100px;
  height: 63px;
  border-radius: 4px;
  border: 1px solid;
  border-color: var(--color-base-neutral40);
  border-color: light-dark(
    var(--color-base-neutral40),
    var(--color-base-neutral45)
  );
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

export const Title = styled.span`
  display: block;
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
  font-variant: none;
  text-align: left;
  margin-block: 0;
  font-family: var(--font-family-sans);
`;
