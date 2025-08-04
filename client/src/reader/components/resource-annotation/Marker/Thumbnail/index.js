import { useCallback, useEffect, useContext, useState, useMemo } from "react";
import IconComposer from "global/components/utility/IconComposer";
import { useFromStore } from "hooks";
import { useWindowSize } from "usehooks-ts";
import capitalize from "lodash/capitalize";
import { MarkerContext } from "../../context";
import * as Styled from "./styles";

export default function Thumbnail({
  id,
  hidden,
  setsPosition,
  active,
  onMouseEnter,
  onMouseLeave,
  handleClick
}) {
  const annotation = useFromStore(`entityStore.entities.annotations["${id}"]`);

  const { resourceId, resourceCollectionId } = annotation?.attributes;

  const resource = useFromStore(
    `entityStore.entities.resources["${resourceId}"]`
  );
  const collection = useFromStore(
    `entityStore.entities.resourceCollections["${resourceCollectionId}"]`
  );

  const entity = resource ?? collection;

  const { setResourceThumbs, thumbCount } = useContext(MarkerContext);

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
        rootMargin: "-80px 0px -20px 600px",
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

  const { font, fontSize, margins } = useFromStore(
    `ui.persistent.reader.typography`
  );

  const { width } = useWindowSize();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (setsPosition && el) {
      const rect = el.getBoundingClientRect();
      setResourceThumbs(thumbs => {
        return {
          ...thumbs,
          [id]: {
            top: rect.y,
            height: rect.height
          }
        };
      });
    }
  }, [
    el,
    setsPosition,
    id,
    setResourceThumbs,
    font,
    fontSize.current,
    margins.current,
    width,
    thumbCount
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!entity) return null;

  const { title, kind, variantThumbnailStyles } = entity.attributes;

  const onClick = handleClick(entity.id, annotation.type);

  const WrapperComponent = hidden ? Styled.PositionerWrapper : Styled.Wrapper;
  const wrapperProps = hidden
    ? { "aria-hidden": true }
    : {
        $visible: visible,
        $active: active,
        onMouseEnter,
        onMouseLeave,
        onClick
      };

  return (
    <WrapperComponent id={id} ref={ref} {...wrapperProps}>
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
    </WrapperComponent>
  );
}
