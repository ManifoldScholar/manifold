import styled from "@emotion/styled";
import * as StyledThumbnail from "frontend/components/resourceish/Thumbnail/styles";
import { respond } from "theme/styles/mixins";

export const Wrapper = styled(StyledThumbnail.Wrapper)`
  --Thumbnail-background-color: var(--color-base-neutral20);
  --Thumbnail-border-radius: var(--box-border-radius);
  --Thumbnail-Title-width: 100%;
  --Thumbnail-Icon-color: var(--color-base-neutral40);
  --Thumbnail-Icon-background-color: transparent;
`;

export const Inner = styled(StyledThumbnail.Inner)`
  align-items: center;
  min-height: 132px;

  ${respond(`min-height: 160px;`, 60)}
`;
