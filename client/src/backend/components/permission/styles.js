import styled from "@emotion/styled";
import { respond, defaultTransitionProps } from "theme/styles/mixins";

export const User = styled.div`
  display: flex;
  align-items: center;
`;

export const Avatar = styled.figure`
  margin-right: 15px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 100%;
  }

  svg {
    width: 50px;
    height: 50px;
    color: var(--color-base-neutral45);
  }
`;

export const Name = styled.h3`
  font-family: var(--font-family-sans);
  max-width: 100%;
  margin: 0;
  line-height: 21px;
  color: var(--color-base-neutral30);
  letter-spacing: 0.015em;
  transition: color ${defaultTransitionProps};
  font-size: 18px;

  ${respond(`font-size: 22px;`, 80)}
  }
`;
