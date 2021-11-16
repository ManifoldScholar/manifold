import styled from "@emotion/styled";
import UniqueIcons from "global/components/icon/unique";

export const Avatar = styled.img`
  width: var(--Avatar-width);
  height: var(--Avatar-height);
  border: 1px solid transparent;
  transition: border var(--transition-duration-default)
    var(--transition-timing-function);
`;

export const Placeholder = styled(UniqueIcons.ProjectPlaceholderUnique)`
  width: var(--Avatar-width);
  height: var(--Avatar-height);
  max-height: 130px;
  transition: fill var(--transition-duration-default)
    var(--transition-timing-function);
`;
