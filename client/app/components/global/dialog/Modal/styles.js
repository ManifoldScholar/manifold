import styled from "@emotion/styled";
import { transparentize, defaultTransitionProps } from "theme/styles/mixins";

export const Dialog = styled.dialog`
  background-color: transparent;
  margin: 0px;
  padding: 0px;
  border: 0px;
  max-inline-size: 100dvw;
  max-block-size: 100dvh;
  inline-size: 100%;
  block-size: 100%;
  overflow-y: scroll;
  transition: opacity ${defaultTransitionProps}, display ${defaultTransitionProps};
  opacity: 1;

  @starting-style {
    opacity: 0;
  }

  &::backdrop {
    .backend & {
      background-color: ${transparentize("neutralBlack", 0.35)};
    }
  
    .browse & {
      background-color: ${transparentize("neutralWhite", 0.1)};
    }
  
    .reader & {
      background-color: ${transparentize("neutralBlack", 0.7)};
    }
  }
}
`;

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  block-size: auto;
  min-block-size: 100%;
  padding-block: 30px;
  padding-inline: var(--container-padding-inline-responsive);
`;
