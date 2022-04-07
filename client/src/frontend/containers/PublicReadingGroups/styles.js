import styled from "@emotion/styled";
import { containerPrototype } from "theme/styles/mixins";

const containerGap = "50px";

export const Container = styled.div`
  ${containerPrototype}
  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);

  > * + * {
    margin-top: ${containerGap};
  }
`;
