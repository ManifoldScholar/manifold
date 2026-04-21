import styled from "@emotion/styled";

export const Subtitle = styled.div`
  margin-top: 4px;
  font-family: var(--font-family-sans);
  font-size: 15px;
  font-weight: var(--font-weight-regular);
  color: var(--color-neutral-text-dark);
`;

export const CoverWrap = styled.div`
  position: relative;

  .collecting-toggle.collecting-toggle--project-cover {
    top: 6px;
    left: auto;
    right: 6px;
  }
`;
