import { useState, useCallback, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import capitalize from "lodash/capitalize";
import { ReaderContext } from "app/contexts";
import { ResourceMarkerContext } from "./context";
import useLoaderCollection from "hooks/useLoaderCollection";
import MobileMarker from "./Mobile";
import Sidebar from "./Sidebar";
import { useWindowSize } from "usehooks-ts";
import * as Styled from "./styles";

export default function Marker({ annotation }) {
  const { t } = useTranslation();

  const readerContext = useContext(ReaderContext);
  const activeAnnotation = readerContext?.activeAnnotation;
  const readerDispatch = readerContext?.dispatch;
  const setActiveAnnotation = annotationId =>
    readerDispatch?.({
      type: "SET_ACTIVE_ANNOTATION",
      payload: annotationId ? { annotationId } : null
    });

  const { typography } = readerContext ?? {};
  const { font, fontSize, margins } = typography ?? {};

  const [markerEl, setMarkerEl] = useState(null);
  const [left, setLeft] = useState(0);

  const { width } = useWindowSize();

  const { thumbCount, openDialog } = useContext(ResourceMarkerContext) ?? {};

  const resources = useLoaderCollection("resources");
  const resourceCollections = useLoaderCollection("resource_collections");

  const markerRef = useCallback(node => {
    if (node !== null) {
      setMarkerEl(node);
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (markerEl) {
      const rect = markerEl.getBoundingClientRect();
      setLeft(rect.left);
    }
  }, [markerEl, width, font, fontSize.current, margins.current, thumbCount]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const { id, resourceId, resourceCollectionId } = annotation;

  const resource = resources.find(r => r.id === resourceId);
  const collection = resourceCollections.find(
    c => c.id === resourceCollectionId
  );

  /* eslint-disable no-nested-ternary */
  const kind = resource
    ? resource.attributes.kind
    : collection
    ? "collection"
    : "file";

  const icon = `resource${capitalize(kind)}64`;

  const dialogProps = useMemo(
    () =>
      resource
        ? {
            resource: { id: resourceId, type: "resource" },
            annotation: { id, type: "annotations" }
          }
        : {
            resource: { id: resourceCollectionId, type: "resourceCollection" },
            annotation: { id, type: "annotations" }
          },
    [resource, resourceId, resourceCollectionId, id]
  );

  const handleClick = useCallback(
    props => e => {
      e.preventDefault();
      openDialog(props);
    },
    [openDialog]
  );

  const resourceTitle =
    resource?.attributes.titlePlaintext ?? collection?.attributes.title;
  const accesibleTitle = t("reader.actions.open_resource_modal", {
    title: resourceTitle
  });

  return (
    <Styled.Wrapper data-annotation-resource-unselectable ref={markerRef}>
      <Styled.Marker
        $active={id === activeAnnotation}
        data-annotation-notation={id}
        onClick={handleClick(dialogProps)}
        onMouseEnter={() => setActiveAnnotation(id)}
        onMouseLeave={() => setActiveAnnotation(null)}
      >
        <span className="screen-reader-text">{accesibleTitle}</span>
        <IconComposer size={20} icon={icon} />
      </Styled.Marker>
      <MobileMarker
        id={id}
        icon={icon}
        handleClick={handleClick(dialogProps)}
        setActiveAnnotation={setActiveAnnotation}
        accesibleTitle={accesibleTitle}
      />
      <Sidebar
        id={id}
        left={left}
        handleClick={handleClick}
        setActiveAnnotation={setActiveAnnotation}
      />
    </Styled.Wrapper>
  );
}

Marker.propTypes = {
  annotations: PropTypes.array,
  activeAnnotation: PropTypes.string
};

Marker.displayName = "ResourceAnnotation.Marker";
