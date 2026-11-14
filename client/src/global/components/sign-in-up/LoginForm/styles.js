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

export const LinkInstructions = styled.p`
  margin-block-start: 0;
  margin-block-end: 25px;
  padding: 1rem;
  color: var(--color-neutral-text-extra-dark);
  border-radius: var(--box-border-radius);
  background: var(--color-base-red20);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-regular);
`;
