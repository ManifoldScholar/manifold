import styled from "@emotion/styled";

export const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-base-neutral-black);
  object-fit: contain;
`;

export const InteractiveWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const Default = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background-position: 50% 50%;
  background-size: cover;
`;
