import styled from "@emotion/styled";
import { Link as LinkComponent } from "react-router-dom";
import { respond, listUnstyled, rgba, fluidScale } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { Wrapper as Thumbnail } from "frontend/components/resourceish/Thumbnail/styles";

const breakpoint = breakpoints[60];
const maxGap = "25px";
const minGap = "20px";
const itemMinWidth = "195px";

export const Grid = styled.ul`
  ${listUnstyled}
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: ${fluidScale(maxGap, minGap)};

  ${respond(
    `grid-template-columns: repeat(auto-fill, minmax(${itemMinWidth}, 1fr));`,
    breakpoint
  )}
`;

export const Link = styled(LinkComponent)`
  --Thumbnail-background-color: var(
    --card-bg-color,
    var(--color-base-neutral05)
  );
  --Thumbnail-border-radius: var(--box-border-radius);
  --Thumbnail-Icon-background-color: transparent;

  display: flex;
  width: 100%;
  height: 100%;
  text-decoration: none;
  transition: none;

  &:hover,
  &.focus-visible {
    --Thumbnail-box-shadow: 0 20px 30px 2px ${rgba("neutralBlack", 0.13)};

    outline: none;

    ${Thumbnail} {
      // need to define in Thumbnail so --hover-color respects .bg- class there
      --Thumbnail-color: var(--hover-color);
    }
  }
`;
