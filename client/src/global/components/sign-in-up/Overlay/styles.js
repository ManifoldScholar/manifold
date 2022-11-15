import styled from "@emotion/styled";
import {
  transparentize,
  defaultTransitionProps,
  respond,
  defaultFocusStyle,
  headerContainerPrimary,
  containerPrototype
} from "theme/styles/mixins";

export const Dialog = styled.div`
  --color: var(--color-neutral-text-light);
  --highlight-color: var(--color-interaction-light);
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);
  --input-border-color: var(--color-base-neutral-white);

  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  font-size: 18px;
  font-family: var(--font-family-copy);
  color: var(--color);
  background-color: ${transparentize("neutral90", 0.025)};
  opacity: 1;
  transition: opacity 0s linear;
  z-index: 600;

  a {
    text-decoration: underline;
  }

  .overlay-full-enter > & {
    opacity: 0;
  }

  .overlay-full-enter-active > & {
    opacity: 1;
    transition: opacity ${defaultTransitionProps};
  }

  .overlay-full-exit > & {
    opacity: 0;
    transition: opacity ${defaultTransitionProps};
  }
`;

export const Header = styled.div`
  position: fixed;
  width: 100%;
  z-index: 1;
`;

export const HeaderInner = styled.div`
  ${headerContainerPrimary}
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Content = styled.div`
  position: absolute;
  top: 80px;
  bottom: 0;
  width: 100%;
  overflow: auto;

  ${respond(`top: 0;`, 90)}
`;

export const LayoutContainer = styled.div`
  ${containerPrototype}
  padding-block-start: var(--container-padding-block-start);
  padding-block-end: 100px;
`;

export const FormContainer = styled.div`
  max-width: 340px;
  margin: 0 auto;

  ${respond(`padding-top: 35px;`, 40)}
  ${respond(`padding-top: 126px;`, 90)}

  form {
    &:focus:not(.focus-visible) {
      outline: 0;
    }

    &:focus-visible {
      ${defaultFocusStyle}
      outline-offset: 5px;
    }
  }
`;
