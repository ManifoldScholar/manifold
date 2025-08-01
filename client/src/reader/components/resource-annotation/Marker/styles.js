import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { readerContainerWidths } from "theme/styles/utility/layout";

export const Wrapper = styled.span`
  position: relative;
`;

const paddings = readerContainerWidths
  .map(
    (width, i) => `
  --margin-width: calc((100% - ${width}) / 2);
  --thumbnail-padding: calc(var((--margin-width) - 200px) / 2);

  .container-width-${i} & {
    padding-inline: calc((((100vw - ${width}) / 2) - 200px) / 2);
  }
`
  )
  .join("");

export const Thumbnail = styled.div`
  display: none;
  position: absolute;
  left: ${({ $left }) => ($left ? `-${$left}px` : 0)};
  top: -50%;
  height: max-content;

  ${paddings}

  .container-width-1 & {
    ${respond(`display: block;`, "1360px")}
  }

  .container-width-2 & {
    ${respond(`display: block;`, "1240px")}
  }

  ${({ $hidden }) => $hidden && `z-index: -1`}

  ${({ $right }) =>
    $right && `left: auto; right: calc((100vw - ${$right}px) * -1);`}
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-block-start: ${({ $count }) => `calc(-1 * ${$count} * 10px)`};
`;
