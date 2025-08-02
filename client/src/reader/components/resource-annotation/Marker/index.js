import { useState, useCallback, useEffect, useMemo, useContext } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import lh from "helpers/linkHandler";
import { uiReaderActions } from "actions";
import { useDispatch } from "react-redux";
import capitalize from "lodash/capitalize";
import { useFromStore } from "hooks";
import { useNavigate, useLocation } from "react-router-dom-v5-compat";
import { MarkerContext } from "../context";
import Thumbnail from "./Thumbnail";
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
    (entityId, type) => e => {
      e.preventDefault();

      const target =
        type === "resource_collection"
          ? lh.link("frontendProjectResourceCollectionRelative", entityId)
          : lh.link("frontendProjectResourceRelative", entityId);

      const url = `${location.pathname}/${target}`;
      navigate(url, { noScroll: true });
    },
    [navigate, location.pathname]
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

  const { id, resourceId, resourceCollectionId } = annotation;

  const { groups } = useContext(MarkerContext);

  const group = useMemo(() => Object.values(groups).find(g => g.includes(id)), [
    groups,
    id
  ]);

  const rendersGroup = useMemo(() => {
    return group ? group.indexOf(id) === 0 : false;
  }, [id, group]);

  const resource = useFromStore(
    `entityStore.entities.resources["${resourceId}"]`
  );
  const collection = useFromStore(
    `entityStore.entities.resourceCollections["${resourceCollectionId}"]`
  );

  /* eslint-disable no-nested-ternary */
  const kind = resource
    ? resource.attributes.kind
    : collection
    ? "collection"
    : "file";

  const active = id === activeAnnotation;

  return (
    <Styled.Wrapper ref={markerRef}>
      <Styled.Marker
        $active={active}
        data-annotation-notation={id}
        onClick={handleClick(
          resourceId ?? resourceCollectionId,
          annotation.type
        )}
        onMouseEnter={() => setActiveAnnotation(id)}
        onMouseLeave={() => setActiveAnnotation(null)}
      >
        <IconComposer size={20} icon={`resource${capitalize(kind)}64`} />
      </Styled.Marker>
      <Styled.Sidebar $left={left} $hidden={!!group}>
        <Thumbnail
          id={id}
          hidden={!!group}
          active={active}
          onMouseEnter={() => setActiveAnnotation(id)}
          onMouseLeave={() => setActiveAnnotation(null)}
          handleClick={handleClick}
          setsPosition
        />
      </Styled.Sidebar>
      {rendersGroup && (
        <>
          <Styled.Sidebar $left={left}>
            <Styled.Group $count={group.length}>
              {group.map(notationId => (
                <Thumbnail
                  id={notationId}
                  active={notationId === activeAnnotation}
                  onMouseEnter={() => setActiveAnnotation(notationId)}
                  onMouseLeave={() => setActiveAnnotation(null)}
                  handleClick={handleClick}
                  grouped
                />
              ))}
            </Styled.Group>
          </Styled.Sidebar>
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
