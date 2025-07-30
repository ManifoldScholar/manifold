import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import BodyNodes from "./body-nodes";
import { MarkerContext } from "reader/components/resource-annotation/context";
import isEqual from "lodash/isEqual";

export default function Body(props) {
  const { section, annotations, pendingAnnotation, location } = props;
  const deps = [
    section.attributes.bodyJSON,
    annotations,
    pendingAnnotation,
    location.key
  ];

  const [thumbOffsets, setThumbOffsets] = useState({});
  const overlaps = useMemo(
    () =>
      Object.keys(thumbOffsets).reduce((groups, id) => {
        if (thumbOffsets[id] < 40) return groups;
        const filtered = { ...thumbOffsets, [id]: undefined };
        const current = thumbOffsets[id];
        const group = Object.keys(filtered)
          .filter(key => filtered[key] >= 40)
          .filter(key => Math.abs(current - filtered[key]) <= 100);
        if (!group.length) return groups;
        if (
          Object.keys(groups).some(key =>
            isEqual(groups[key].toSorted(), [id, ...group].toSorted())
          )
        )
          return groups;
        return { ...groups, [Object.keys(groups).length]: [id, ...group] };
      }, {}),
    [thumbOffsets]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  const iterator = useMemo(
    () => new BodyNodes.Helpers.NodeTreeIterator(props),
    [deps]
  );
  const elements = useMemo(() => iterator.visit(section.attributes.bodyJSON), [
    iterator,
    section.attributes.bodyJSON
  ]);

  return (
    <MarkerContext.Provider
      value={{
        thumbOffsets,
        setThumbOffsets,
        overlaps
      }}
    >
      {elements}
    </MarkerContext.Provider>
  );
}

Body.propTypes = {
  section: PropTypes.object,
  annotations: PropTypes.array,
  pendingAnnotation: PropTypes.object,
  location: PropTypes.object
};

Body.displayName = "Reader.Section.Body";
