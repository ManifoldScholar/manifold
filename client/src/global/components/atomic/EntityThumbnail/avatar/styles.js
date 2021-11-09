import { styled } from "@linaria/react";

export const Avatar = styled.img`
  width: var(--Avatar-width);
  height: var(--Avatar-height);
  border: 1px solid transparent;
  transition: border var(--transition-duration-default)
    var(--transition-timing-function);
`;

export const Placeholder = styled.div`
  width: var(--Avatar-width);
  height: var(--Avatar-height);

  > svg {
    width: var(--Avatar-width);
    height: var(--Avatar-height);
    max-height: 130px;
    transition: fill var(--transition-duration-default)
      var(--transition-timing-function);
  }
`;
