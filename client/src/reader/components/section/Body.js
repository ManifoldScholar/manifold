import { useMemo } from "react";
import PropTypes from "prop-types";
import BodyNodes from "./body-nodes";
import ResourceMarkerContextProvider from "reader/components/resource-annotation/Marker/context";

export default function Body(props) {
  const { section, annotations, pendingAnnotation, location } = props;
  const deps = [
    section.attributes.bodyJSON,
    annotations,
    pendingAnnotation,
    location.key
  ];

  /* eslint-disable react-hooks/exhaustive-deps */
  const iterator = useMemo(
    () => new BodyNodes.Helpers.NodeTreeIterator(props),
    [...deps]
  );
  const elements = useMemo(() => iterator.visit(section.attributes.bodyJSON), [
    iterator,
    section.attributes.bodyJSON
  ]);

  return (
    <ResourceMarkerContextProvider annotations={annotations}>
      {elements}
    </ResourceMarkerContextProvider>
  );
}

Body.propTypes = {
  section: PropTypes.object,
  annotations: PropTypes.array,
  pendingAnnotation: PropTypes.object,
  location: PropTypes.object
};

Body.displayName = "Reader.Section.Body";
