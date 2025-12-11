import styled from "@emotion/styled";
import { panelRounded, fluidScale } from "theme/styles/mixins";

export const Wrapper = styled.div`
  ${panelRounded}
  padding: min(6.846vw, 70px);
  color: var(--strong-color);
  text-align: center;
  font-family: var(--font-family-sans);
`;

export const Inner = styled.div`
  max-width: 740px;
  margin-right: auto;
  margin-left: auto;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  hyphens: none;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 86px;
  margin-bottom: 28px;
  color: var(--placeholder-icon-color);
  background-color: var(--box-strong-bg-color);
  border-radius: 50%;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${fluidScale("30px", "25px")};
  font-weight: var(--font-weight-medium);
`;

export const Body = styled.div`
  margin-top: 24px;
  font-size: 16px;
  line-height: 1.5;

  > * + * {
    margin-top: 1em;
  }

  a {
    text-decoration-line: underline;

    &:visited {
      color: var(--hover-color);
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: min(5.86vw, 60px);
`;
