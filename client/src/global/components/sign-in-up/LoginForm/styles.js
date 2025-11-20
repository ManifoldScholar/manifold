import styled from "@emotion/styled";

export const NotificationsWrapper = styled.div`
  margin-block-end: 25px;
`;

export const OauthWrapper = styled.div`
  margin-block-start: 15px;

  > * + * {
    margin-block-start: 30px;
  }
`;
