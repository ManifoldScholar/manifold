import { useState, useCallback, useEffect, useMemo, useContext } from "react";
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
import { useWindowSize } from "usehooks-ts";
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

  const [markerEl, setMarkerEl] = useState(null);
  const [left, setLeft] = useState(0);

  const { width } = useWindowSize();

  const markerRef = useCallback(node => {
    if (node !== null) {
      setMarkerEl(node);
    }
  }, []);

  useEffect(() => {
    if (markerEl) {
      const rect = markerEl.getBoundingClientRect();
      setLeft(rect.left);
    }
  }, [markerEl, width]);

  const id = annotation.id;

  const markerClassNames = classnames({
    "notation-marker": true,
    "notation-marker--active": id === activeAnnotation
  });

  const { groups } = useContext(MarkerContext);

  const group = useMemo(() => Object.values(groups).find(g => g.includes(id)), [
    groups,
    id
  ]);

  const rendersGroup = useMemo(() => {
    return group ? group.indexOf(id) === 0 : false;
  }, [id, group]);

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
      <Styled.Thumbnail $left={left} $hidden={!!group}>
        <ThumbnailInner id={id} hidden={!!group} setsPosition />
      </Styled.Thumbnail>
      {rendersGroup && (
        <>
          <Styled.Thumbnail $left={left}>
            <Styled.Group $count={group.length}>
              {group.map(notationId => (
                <ThumbnailInner id={notationId} grouped />
              ))}
            </Styled.Group>
          </Styled.Thumbnail>
        </>
      )}
    </Styled.Wrapper>
  );
}

Marker.propTypes = {
  annotations: PropTypes.array,
  activeAnnotation: PropTypes.string
};

Marker.displayName = "ResourceAnnotation.Marker";
