import { useCallback, useEffect, useContext, useState, useMemo } from "react";
import IconComposer from "global/components/utility/IconComposer";
import { useFromStore } from "hooks";
import capitalize from "lodash/capitalize";
import { MarkerContext } from "../../context";
import * as Styled from "./styles";

export default function Thumbnail({ id, grouped, hidden, setsPosition }) {
  const annotation = useFromStore(`entityStore.entities.annotations["${id}"]`);

  const { resourceId, resourceCollectionId } = annotation?.attributes;

  const resource = useFromStore(
    `entityStore.entities.resources["${resourceId}"]`
  );
  const collection = useFromStore(
    `entityStore.entities.resourceCollections["${resourceCollectionId}"]`
  );

  const entity = resource ?? collection;

  const { setResourceThumbs } = useContext(MarkerContext);

  const [visible, setVisible] = useState(false);
  const [el, setEl] = useState(null);

  const ref = useCallback(node => {
    if (node !== null) {
      setEl(node);
    }
  }, []);

  const callback = useCallback(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting !== visible) setVisible(entry.isIntersecting);
      });
    },
    [visible, setVisible]
  );

  const observer = useMemo(
    () =>
      new IntersectionObserver(callback, {
        root: null,
        rootMargin: "-40px 0px -20px 600px",
        threshold: 0.75
      }),
    [callback]
  );

  useEffect(() => {
    if (el) {
      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    }
  }, [el, observer]);

  useEffect(() => {
    if (setsPosition && el) {
      const rect = el.getBoundingClientRect();
      setResourceThumbs(thumbs => {
        return {
          ...thumbs,
          [id]: {
            top: rect.y,
            height: rect.height,
            el
          }
        };
      });
    }
  }, [el, setsPosition, id, setResourceThumbs]);

  if (!entity) return null;

  const { title, kind, variantThumbnailStyles } = entity.attributes;

  return (
    <Styled.Wrapper
      id={id}
      ref={ref}
      $grouped={grouped}
      $visible={visible}
      $hidden={hidden}
      aria-hidden={hidden}
    >
      <Styled.Label>
        <IconComposer icon={`resource${capitalize(kind)}64`} size={20} />
        <span>{kind}</span>
      </Styled.Label>
      <Styled.Content>
        {!!variantThumbnailStyles?.medium && (
          <Styled.ImageWrapper>
            <Styled.Image src={variantThumbnailStyles.medium} />
          </Styled.ImageWrapper>
        )}
        <Styled.Title>{title}</Styled.Title>
      </Styled.Content>
    </Styled.Wrapper>
  );
}
