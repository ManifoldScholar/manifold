import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { transientOptions } from "helpers/emotionHelpers";

export const ItemLink = styled(Link, transientOptions)`
  --Avatar-width: ${({ $stack }) => ($stack ? "auto" : "50px")};
  --Avatar-height: ${({ $stack }) => ($stack ? "100%" : "auto")};
  --Cover-width: ${({ $stack }) => ($stack ? "100%" : "50px")};
  --Cover-margin-bottom: ${({ $stack }) => ($stack ? "16px" : 0)};

  display: flex;
  padding: 15px 0;
  color: inherit;
  text-decoration: none;
  transition: background-color var(--transition-duration-default)
      var(--transition-timing-function),
    box-shadow var(--transition-duration-default)
      var(--transition-timing-function);

  &:hover {
    color: inherit;
  }

  ${({ $stack }) =>
    $stack &&
    `flex-direction: column;
    height: 100%;
    padding: min(2.105vw, 25px);
    border-radius: var(--box-border-radius);

    &[href]:hover,
    &[href].focus-visible {
      outline: 0;
      box-shadow: 0 31px 44px 2px rgba(0, 0, 0, 0.13);
      background-color: var(--box-medium-bg-color);
    }`}
`;

export const Cover = styled("figure", transientOptions)`
  position: relative;
  width: var(--Cover-width);
  padding-top: 0;
  margin-bottom: var(--Cover-margin-bottom);
  line-height: 1;
  height: ${({ $stack }) => ($stack ? "160px" : "auto")};
`;

export const Wrapper = styled.div`
  position: relative;
`;
