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
    kind,
    title,
    variantThumbnailStyles,
    thumbnailStyles,
    attachmentStyles,
    attachmentAltText,
    variantThumbnailAltText
  } = entity.attributes;

  /* eslint-disable no-nested-ternary */
  const imgProps =
    kind === "image"
      ? { src: attachmentStyles?.smallLandscape, alt: attachmentAltText || "" }
      : variantThumbnailStyles?.smallLandscape
      ? {
          src: variantThumbnailStyles.smallLandscape,
          alt: variantThumbnailAltText || ""
        }
      : {
          src:
            thumbnailStyles?.smallLandscape ?? attachmentStyles?.smallLandscape,
          alt: ""
        };

  return active ? (
    <Styled.Wrapper
      data-annotation-resource-mobile
      data-hover-override={hoverOverride}
    >
      <Styled.Content>
        <Styled.ImageWrapper>
          {imgProps.src ? (
            <Styled.Image {...imgProps} />
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
