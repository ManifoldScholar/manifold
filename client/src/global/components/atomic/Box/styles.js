import styled from "@emotion/styled";
import {
  panelRounded,
  containerPrototype,
  fluidScale
} from "theme/styles/mixins";
import { containerPaddingInline } from "theme/styles/variables/layout";

export const Container = styled.section`
  ${containerPrototype}
  padding-inline: var(--Box-padding-inline, ${fluidScale(
    containerPaddingInline.full,
    "0px",
    120,
    35
  )});
  padding-block: var(--Box-padding-block, 0);
`;

export const Background = styled.div`
  ${panelRounded}
  padding-block-start: var(--Box-Background-padding-block-start, ${fluidScale(
    "45px",
    "20px"
  )});
  padding-block-end: var(--Box-Background-padding-block-end, ${fluidScale(
    "45px",
    "20px"
  )});
  padding-inline: var(
    --Box-Background-padding-inline,
    ${fluidScale("72px", "20px")}
  );
`;
