import styled from "@emotion/styled";

export const Wrapper = styled.div`
  position: relative;
  block-size: 100%;
`;

export const Image = styled.img`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: 50% 50%;
`;
