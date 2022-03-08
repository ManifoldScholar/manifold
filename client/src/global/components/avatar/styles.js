import styled from "@emotion/styled";

export const ImageAvatar = styled.div`
  background-size: cover;
  background-position: 50% 50%;
  background-image: url(${({ $url }) => $url});
  width: 100%;
  height: 0;
  padding-block-start: 100%;
  border-radius: 100%;
`;
