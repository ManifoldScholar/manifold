import { useFromStore } from "hooks";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function ThumbnailMobile({ id, active, handleClick }) {
  const annotation = useFromStore(`entityStore.entities.annotations["${id}"]`);

  const { resourceId, resourceCollectionId } = annotation?.attributes;

  const resource = useFromStore(
    `entityStore.entities.resources["${resourceId}"]`
  );
  const collection = useFromStore(
    `entityStore.entities.resourceCollections["${resourceCollectionId}"]`
  );

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

  return (
    <Styled.Wrapper>
      <Styled.Content>
        {!!imgSrc && (
          <Styled.ImageWrapper>
            <Styled.Image src={imgSrc} />
          </Styled.ImageWrapper>
        )}
        <Styled.Title>{title}</Styled.Title>
        {/* Remove from tab order since clicking the resource marker also opens the detail modal */}
        <Styled.ViewButton
          tabIndex={-1}
          aria-hidden
          onClick={handleClick(
            resourceId ?? resourceCollectionId,
            annotation.type
          )}
        >
          <IconComposer size={20} icon="eyeOpen32" />
        </Styled.ViewButton>
      </Styled.Content>
    </Styled.Wrapper>
  );
}
