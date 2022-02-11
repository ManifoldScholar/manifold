import styled from "@emotion/styled";
import { containerPrototype, fluidScale } from "theme/styles/mixins";
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
  color: var(--box-color);
  background-color: var(--box-bg-color);
  border-radius: var(--Box-border-radius, var(--box-border-radius));
  padding-block-start: var(
    --Box-Background-padding-block-start,
    ${fluidScale("45px", "20px")}
  );
  padding-block-end: var(
    --Box-Background-padding-block-end,
    ${fluidScale("45px", "20px")}
  );
  padding-inline: var(
    --Box-Background-padding-inline,
    ${fluidScale("72px", "20px")}
  );
`;
