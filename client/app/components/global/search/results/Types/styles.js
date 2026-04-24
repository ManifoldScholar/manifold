import styled from "styled-components";
import EntityThumbnail from "components/global/entity-thumbnail";

export const Avatar = styled.img`
  border: 2px solid var(--color-base-neutral50);
  border-radius: 50%;
  max-width: 56px;
  margin-block-start: 6px;
`;

export const IconAvatar = styled.div`
  svg {
    position: relative;
    left: -6px;
    width: 68px;
    max-width: 68px;
    height: 68px;
    color: var(--color-neutral-ui-dark);
  }
`;

export const AnnotationTitle = styled.span`
  color: var(--color-neutral-text-dark);
`;

export const ThumbnailNarrow = styled(EntityThumbnail.Text)`
  ${({ $isSvg }) =>
    $isSvg &&
    `
      max-width: 76px;
      margin-inline-start: -10px;
      color: var(--color-neutral-ui-dark);
  `}
`;

export const Thumbnail = styled(EntityThumbnail.Project)`
  max-width: 56px;
  max-height: 56px;
  color: var(--color-neutral-ui-dark);

  ${({ $isImg }) =>
    $isImg &&
    `margin-block-start: 6px;
    max-height: 100%;
    `}
`;
