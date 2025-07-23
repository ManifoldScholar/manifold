import styled from "@emotion/styled";
import { clearfix, respond, containerPrototype } from "theme/styles/mixins";

export const Wrapper = styled.div`
  ${clearfix()}
  padding-top: 22px;
`;

export const Container = styled.div`
  ${containerPrototype}
  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);
  ${clearfix()}
`;

export const Resource = styled.div`
  display: flex;
  align-items: center;

  ${respond(`width: 100%;`, 60)}

  & + * {
    padding-block-start: 7px;
  }
`;

export const Icon = styled.figure`
  padding-right: 14px;

  ${respond(`display: none;`, 60)}

  svg {
    fill: var(--color-base-neutral50);
  }
`;

export const Content = styled.div`
  margin-top: -8px;
  font-family: var(--font-family-copy);
  font-size: 14px;
  line-height: 1.4;

  ${respond(`font-size: 16px;`, 60)}

  /* These are here for styling html from captionFormatted and descriptionFormatted. -LD */
  p + p {
    margin-top: 1em;
  }

  a {
    color: var(--color-base-neutral75);

    &:visited {
      color: var(--color-base-neutral75);
    }
  }
`;
