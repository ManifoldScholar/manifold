import styled from "styled-components";

export const Icon = styled.div`
  max-width: 80px;
  max-height: 80px;
  background-color: var(--color-base-neutral10);
  border-radius: 6px;
  color: var(--color-base-neutral90);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Avatar = styled.figure`
  > svg {
    max-height: 80px;
    max-width: 80px;
  }
`;

export const Image = styled.figure`
  > img {
    max-height: 110px;
    object-fit: contain;
    object-position: left top;
  }
`;
