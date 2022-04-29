import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";

export const Avatar = styled.figure`
  display: inline-flex;
  align-items: center;
  margin-right: 10px;

  &:not(:last-child) {
    &::after {
      display: inline;
      content: ", ";
    }
  }
`;

export const Image = styled.img`
  display: inline-block;
  width: 42px;
  height: auto;
  margin-right: 6px;
  border: 2px solid var(--color-base-neutral-white);
  border-radius: 100%;
`;

export const Icon = styled(IconComposer)`
  display: inline-block;
  width: 42px;
  height: auto;
  margin-right: 4px;
`;

export const Caption = styled.figcaption`
  display: inline-block;
`;
