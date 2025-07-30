import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useContext
} from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import lh from "helpers/linkHandler";
import { uiReaderActions } from "actions";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import { useFromStore } from "hooks";
import { useNavigate, useLocation } from "react-router-dom-v5-compat";
import { MarkerContext } from "../context";
import ThumbnailInner from "./Thumbnail";
import * as Styled from "./styles";

export default function Marker({ annotation }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const activeAnnotation = useFromStore(
    `ui.transitory.reader.activeAnnotation`
  );

  const setActiveAnnotation = annotationId =>
    dispatch(
      uiReaderActions.setActiveAnnotation({ annotationId, passive: false })
    );

  const handleClick = useCallback(
    e => {
      e.preventDefault();

      const target =
        annotation.type === "resource_collection"
          ? lh.link(
              "frontendProjectResourceCollectionRelative",
              annotation.resourceCollectionId
            )
          : lh.link("frontendProjectResourceRelative", annotation.resourceId);

      const url = `${location.pathname}/${target}`;
      navigate(url, { noScroll: true });
    },
    [annotation, navigate, location.pathname]
  );

  const [visible, setVisible] = useState(false);
  const [left, setLeft] = useState(0);
  const markerRef = useRef();
  const thumbRef = useRef();

  const id = annotation.id;

  const markerClassNames = classnames({
    "notation-marker": true,
    "notation-marker--active": id === activeAnnotation
  });

  const callback = useCallback(
    entries => {
      entries.forEach(entry => {
        const markerLeft = parseFloat(entry.boundingClientRect.left.toFixed(3));
        if (left !== markerLeft) setLeft(markerLeft);

        if (entry.isIntersecting !== visible) setVisible(entry.isIntersecting);
      });
    },
    [left, setLeft, visible, setVisible]
  );

  const observer = useMemo(
    () =>
      new IntersectionObserver(callback, {
        root: null,
        rootMargin: "-40px 0px -100px 0px",
        threshold: 1.0
      }),
    [callback]
  );

  const { setThumbOffsets, overlaps } = useContext(MarkerContext);
  const [top, setTop] = useState(null);

  const group = useMemo(
    () => Object.values(overlaps).find(g => g.includes(id)),
    [overlaps, id]
  );

  const groupIndex = useMemo(() => {
    return group ? group.indexOf(id) : null;
  }, [id, group]);

  const thumbCallback = useCallback(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          setTop(null);
        }
        if (entry.isIntersecting) {
          setTop(entry.intersectionRect.top);
        }
      });
    },
    [setTop]
  );

  const thumbObserver = useMemo(
    () =>
      new IntersectionObserver(thumbCallback, {
        root: null,
        rootMargin: "-40px 0px -20px 0px",
        threshold: 0.5
      }),
    [thumbCallback]
  );

  useEffect(() => {
    if (markerRef.current) observer.observe(markerRef.current);
    if (thumbRef.current) thumbObserver.observe(thumbRef.current);

    return () => {
      observer.disconnect();
      thumbObserver.disconnect();
    };
  }, [markerRef, observer, thumbRef, thumbObserver]);

  useEffect(() => {
    setThumbOffsets(offsets => {
      return { ...offsets, [id]: top };
    });
  }, [top, setThumbOffsets, id]);

  return (
    <Styled.Wrapper
      id={`observer-${id}`}
      ref={markerRef}
      key={id}
      title={id}
      data-annotation-notation={id}
      className={markerClassNames}
      onClick={handleClick}
      onMouseOver={() => setActiveAnnotation(id)}
      onMouseLeave={() => setActiveAnnotation(null)}
    >
      <IconComposer
        icon="resourceFilled24"
        size={28}
        className="notation-marker__icon"
      />
      <Styled.Thumbnail ref={thumbRef} $visible={visible} $left={left}>
        {typeof groupIndex !== "number" && <ThumbnailInner id={id} />}
        {groupIndex === 0 &&
          group.map(notationId => <ThumbnailInner id={notationId} grouped />)}
      </Styled.Thumbnail>
    </Styled.Wrapper>
  );
}

Marker.propTypes = {
  annotations: PropTypes.array,
  activeAnnotation: PropTypes.string
};

Marker.displayName = "ResourceAnnotation.Marker";
