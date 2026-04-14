import styled from "@emotion/styled";
import { clearfix, respond } from "theme/styles/mixins";

export const Mapping = styled.div`
  ${clearfix()}
  position: relative;
  width: 100%;
  font-family: var(--font-family-sans);
`;

export const ColumnLabel = styled.div`
  position: relative;
  float: left;
  width: 50%;
  padding: 0.6em 0.8em;
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-text-extra-dark);
  background-color: var(--color-base-neutral40);
  min-height: calc(1em * var(--line-height));

  ${respond(`width: calc(100% - 21vw);`, 80)}
  ${respond(`width: calc(100% - 23vw);`, 85)}
  ${respond(`width: calc(100% - 300px);`, 110)}

  &::after {
    position: absolute;
    top: 0;
    right: -1em;
    z-index: 10;
    width: 0;
    height: 0;
    content: "";
    border-color: transparent transparent transparent
      var(--color-base-neutral40);
    border-style: solid;
    border-width: 1.2em 0 1.2em 1em;
  }
`;

export const LabelTruncated = styled.span`
  display: block;
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Well = styled.div`
  float: left;
  width: 50%;

  ${respond(`width: 21vw;`, 80)}
  ${respond(`width: 23vw;`, 85)}
  ${respond(`width: 300px;`, 110)}

  &::before {
    position: absolute;
    top: -2px;
    left: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    pointer-events: none;
    content: "";
    background: transparent;
    border: 2px solid var(--color-neutral-ui-extra-dark);
  }

  ${({ $dragOver }) =>
    $dragOver &&
    `
    ::before {
      border-color: var(--highlight-color);
    }
  `}
`;

export const Placeholder = styled.span`
  top: 0;
  z-index: -1;
  display: block;
  padding: 0.6em 0.8em 0.6em 1.6em;
  color: var(--color-base-neutral45);

  ${({ $matched }) => $matched && `position: absolute;`}
`;
