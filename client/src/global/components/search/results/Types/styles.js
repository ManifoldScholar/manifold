import styled from "@emotion/styled";
import EntityThumbnail from "global/components/entity-thumbnail";
import { transientOptions } from "helpers/emotionHelpers";

export const Avatar = styled.img`
  border: 2px solid var(--color-base-neutral50);
  border-radius: 50%;
`;

export const IconAvatar = styled.div`
  svg {
    position: relative;
    left: -6px;
    width: 68px;
    max-width: 68px;
    height: 68px;
  }
`;

export const AnnotationTitle = styled.span`
  color: var(--color-neutral-text-dark);
`;

export const IconThumbnail = styled(EntityThumbnail.Text, transientOptions)`
  ${({ $isSvg }) =>
    $isSvg &&
    `max-width: 76px;
    margin-inline-start: -10px;
  `}
`;
