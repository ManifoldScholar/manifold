import styled from "@emotion/styled";
import {
  headingPrimary,
  headingQuaternary,
  utilityPrimary
} from "theme/styles/mixins";

export const Wrapper = styled.div`
  background-color: var(--color-base-neutral05);
  min-height: 100dvh;
  padding-right: ${p => (p.$sidebarOpen ? "20rem" : "0")};
  transition: padding-right 0.25s ease;
`;

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
  align-items: center;
  padding: 12px 24px;
  background-color: var(--background-color, #fff);
  border-bottom: 1px solid var(--color-neutral-ui-dull-dark);
  min-height: 56px;
`;

export const Main = styled.main`
  max-width: 920px;
  margin-inline: auto;
  padding-inline: 24px;
  padding-block-start: 40px;
  padding-block-end: 64px;

  h1 {
    ${headingPrimary}
    margin: 0 0 8px;
    color: var(--color-neutral-text-extra-dark);
  }

  h2 {
    ${utilityPrimary}
    font-size: 14px;
    margin: 40px 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-neutral-ui-dull-dark);
    color: var(--color-neutral-text-dark);
  }
`;

export const Landing = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0 32px;
  gap: 32px;

  h1 {
    ${headingQuaternary}
  }
`;

export const LandingSearch = styled.div`
  width: 100%;
  max-width: 560px;
`;

export const BrowseButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;
