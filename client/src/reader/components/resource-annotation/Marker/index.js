import { useState, useCallback, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import { uiReaderActions } from "actions";
import { useDispatch } from "react-redux";
import capitalize from "lodash/capitalize";
import { useFromStore } from "hooks";
import { ResourceMarkerContext } from "./context";
import MobileMarker from "./Mobile";
import Sidebar from "./Sidebar";
import { useWindowSize } from "usehooks-ts";
import * as Styled from "./styles";

export default function Marker({ annotation }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const activeAnnotation = useFromStore(
    `ui.transitory.reader.activeAnnotation`
  );
  const setActiveAnnotation = annotationId =>
    dispatch(uiReaderActions.setActiveAnnotation({ annotationId }));

  const { font, fontSize, margins } = useFromStore(
    `ui.persistent.reader.typography`
  );

  const [markerEl, setMarkerEl] = useState(null);
  const [left, setLeft] = useState(0);

  const { width } = useWindowSize();

  const { thumbCount, openDialog } = useContext(ResourceMarkerContext) ?? {};

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

  const icon = `resource${capitalize(kind)}64`;

  const handleClick = useCallback(
    e => {
      e.preventDefault();

      const dialogProps = resource
        ? { id: resourceId, type: "resource" }
        : { id: resourceCollectionId, type: "resourceCollection" };
      openDialog(dialogProps);
    },
    [openDialog, resource, resourceId, resourceCollectionId]
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
        onClick={handleClick}
        onMouseEnter={() => setActiveAnnotation(id)}
        onMouseLeave={() => setActiveAnnotation(null)}
      >
        <span className="screen-reader-text">{accesibleTitle}</span>
        <IconComposer size={20} icon={icon} />
      </Styled.Marker>
      <MobileMarker
        id={id}
        icon={icon}
        handleClick={handleClick}
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
