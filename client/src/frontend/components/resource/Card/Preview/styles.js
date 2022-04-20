import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import {
  respond,
  defaultTransitionProps,
  utilityPrimary
} from "theme/styles/mixins";

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  background-color: var(--color-base-neutral10);
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
`;

export const Link = styled.a`
  width: 100%;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    outline: 0;
  }

  .icon-thumbnail-primary {
    flex-grow: 1;
  }

  .resource-thumbnail-primary {
    flex-grow: 2;
  }
`;

export const TextWrapper = styled.div`
  ${utilityPrimary}
  position: relative; /* Required to rise above overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  /* Padded relative to font-size */
  padding: 1em 6px;
  font-size: 12px;
  line-height: 13px;
  color: var(--color);
  white-space: nowrap;
  background-color: var(--color-base-neutral20);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  ${respond(`padding: 1em 10px;`, 50)}

  ${respond(`font-size: 14px;`, 85)}

  ${Inner}:hover &,
  ${Inner}:focus-visible & {
    color: var(--color-base-neutral-white);
    background-color: var(--hover-color);
  }
`;

export const Text = styled.span`
  position: relative;
  top: -1px;
`;

export const Icon = styled(IconComposer)`
  position: relative;
  top: -1px;
  margin-inline-start: 7px;

  ${respond(`margin-inline-start: 8px;`, 40)}
`;
