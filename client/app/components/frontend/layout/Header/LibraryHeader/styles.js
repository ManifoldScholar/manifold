import styled from "@emotion/styled";
import {
  headerContainerPrimary,
  respond,
  defaultTransitionProps
} from "theme/styles/mixins";

export const Wrapper = styled.div`
  color: var(--color-header-foreground);
  background-color: var(--color-header-background);
`;

export const Inner = styled.div`
  ${headerContainerPrimary}
  display: grid;
  grid-template: "logo breadcrumbs hamburger" / 1fr auto 1fr;
  width: 100%;
  height: 100%;

  ${respond(
    `grid-template: 'logo site-nav . user-nav' / max-content max-content 1fr max-content;`,
    75
  )}
`;

export const Border = styled.div`
  position: absolute;
  width: 100%;
  visibility: hidden;
  border-bottom: 1px solid var(--color-base-neutral40);
  opacity: 0;
  transition: opacity ${defaultTransitionProps},
    visibility ${defaultTransitionProps};
`;
