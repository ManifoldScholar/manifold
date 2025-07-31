import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import BodyNodes from "./body-nodes";
import { MarkerContext } from "reader/components/resource-annotation/context";

export default function Body(props) {
  const { section, annotations, pendingAnnotation, location } = props;
  const deps = [
    section.attributes.bodyJSON,
    annotations,
    pendingAnnotation,
    location.key
  ];

  const [resourceThumbs, setResourceThumbs] = useState({});

  const sorted = Object.keys(resourceThumbs).sort(
    (a, b) => resourceThumbs[a].top - resourceThumbs[b].top
  );

  const getOverlap = (target, positions) => {
    const { height, top } = target;
    const range = top + height + 20;
    return Object.keys(positions).find(
      id => Math.abs(range - resourceThumbs[id].top) < height + 20
    );
  };

  const getAllOverlaps = (target, positions, group = []) => {
    if (!target) return null;

    const nextItem = getOverlap(target, positions);

    if (!nextItem) return { group, rest: positions };

    const groupHeight = target.height + positions[nextItem].height + 20;

    const nextPositions = Object.keys(positions)
      .filter(id => id !== nextItem)
      .reduce((obj, id) => ({ ...obj, [id]: positions[id] }), {});

    return getAllOverlaps({ ...target, height: groupHeight }, nextPositions, [
      ...group,
      nextItem
    ]);
  };

  const { remainder, ...groups } = sorted.reduce(
    (groupsObj, id, i) => {
      const toCheck = Object.keys(groupsObj.remainder)
        .filter(key => key !== id)
        .reduce(
          (obj, key) => ({ ...obj, [key]: groupsObj.remainder[key] }),
          {}
        );

      if (!getOverlap(resourceThumbs[id], toCheck)) return groupsObj;

      const { group, rest } = getAllOverlaps(resourceThumbs[id], toCheck, [id]);
      return { ...groupsObj, [i]: group, remainder: rest };
    },
    { remainder: { ...resourceThumbs } }
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
        groups,
        setResourceThumbs
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
