import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Preview = styled.div`
  .overlay-full & {
    padding-top: 70px;

    ${respond(`padding-top: 120px;`, 70)}
  }
`;

export const Image = styled.img`
  width: 100%;
  height: auto;
`;

export const InteractiveWrapper = styled(Preview)`
  position: relative;
`;

export const VideoWrapper = styled(Preview, transientOptions)`
  position: relative;
  height: 500px;

  ${({ $external }) => $external && `height: 620px;`}
`;
