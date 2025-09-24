import { useFromStore } from "hooks";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function ThumbnailMobile({
  id,
  active,
  handleClick,
  hoverOverride
}) {
  const annotation = useFromStore({
    path: `entityStore.entities.annotations["${id}"]`
  });

  const { resourceId, resourceCollectionId } = annotation?.attributes;

  const resource = useFromStore({
    path: `entityStore.entities.resources["${resourceId}"]`
  });
  const collection = useFromStore({
    path: `entityStore.entities.resourceCollections["${resourceCollectionId}"]`
  });

  const entity = resource ?? collection;

  if (!entity) return null;

  const {
    title,
    variantThumbnailStyles,
    thumbnailStyles,
    attachmentStyles
  } = entity.attributes;

  const imgSrc =
    variantThumbnailStyles?.medium ??
    thumbnailStyles?.medium ??
    attachmentStyles?.medium;

  return active ? (
    <Styled.Wrapper
      data-annotation-resource-mobile
      data-hover-override={hoverOverride}
    >
      <Styled.Content>
        <Styled.ImageWrapper>
          {imgSrc ? (
            <Styled.Image src={imgSrc} />
          ) : (
            <Styled.Icon icon="resourceLink64" size={28} />
          )}
        </Styled.ImageWrapper>
        <Styled.Title>{title}</Styled.Title>
        {/* Remove from tab order since clicking the resource marker also opens the detail modal */}
        <Styled.ViewButton tabIndex={-1} aria-hidden onClick={handleClick}>
          <IconComposer size={20} icon="eyeOpen32" />
        </Styled.ViewButton>
      </Styled.Content>
    </Styled.Wrapper>
  ) : null;
}
