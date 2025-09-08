import { useState, useCallback, useMemo, useEffect } from "react";
import IconComposer from "global/components/utility/IconComposer";
import ThumbnailMobile from "./Thumbnail/Mobile";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function MobileMarker({
  id,
  icon,
  handleClick,
  setActiveAnnotation,
  accesibleTitle
}) {
  const activeAnnotation = useFromStore(
    `ui.transitory.reader.activeAnnotation`
  );

  const [markerEl, setMarkerEl] = useState(null);
  const [visible, setVisible] = useState(false);
  const [hoverOverride, setHoverOverride] = useState(false);

  const markerRef = useCallback(node => {
    if (node !== null) {
      setMarkerEl(node);
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  const callback = useCallback(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          setActiveAnnotation(id);
        } else {
          setVisible(false);
        }
      });
    },
    [id]
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  const observer = useMemo(
    () =>
      new IntersectionObserver(callback, {
        root: null,
        rootMargin: "-80px 0px -100px 0px",
        threshold: 1.0
      }),
    [callback]
  );

  useEffect(() => {
    if (markerEl) {
      observer.observe(markerEl);

      return () => {
        observer.disconnect();
      };
    }
  }, [markerEl, observer]);

  const active = id === activeAnnotation && visible;

  return (
    <>
      <Styled.MarkerMobile
        ref={markerRef}
        data-active={active}
        data-hover-override={hoverOverride}
        data-annotation-notation={id}
        onClick={handleClick}
        onMouseEnter={() => setHoverOverride(true)}
        onMouseLeave={() => setHoverOverride(false)}
      >
        <span className="screen-reader-text">{accesibleTitle}</span>
        <IconComposer size={20} icon={icon} />
      </Styled.MarkerMobile>
      <ThumbnailMobile
        id={id}
        active={hoverOverride || active}
        hoverOverride={hoverOverride}
        handleClick={handleClick}
      />
    </>
  );
}
