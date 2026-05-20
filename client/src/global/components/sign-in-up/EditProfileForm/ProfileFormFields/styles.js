import styled from "@emotion/styled";

export const Text = styled.p`
  margin-block-end: 20px;
`;

export const EmailLabel = styled(Text)`
  margin-block-end: 5px;
`;

export const TextBlock = styled.p`
  font-size: clamp(17px, calc(17px + 3 * (100vw - 620px) / 404), 20px);
  margin-block-end: 25px;
  color: var(--highlight-color);
`;
