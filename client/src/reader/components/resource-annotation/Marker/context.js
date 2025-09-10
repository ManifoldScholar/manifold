import { createContext, useState, useMemo, useCallback } from "react";
import Dialog from "../Dialog";
import useDialog from "@castiron/hooks/useDialog";

export const ResourceMarkerContext = createContext({});

export default function ResourceMarkerContextProvider({
  annotations,
  children
}) {
  const thumbCount = useMemo(
    () =>
      annotations
        ?.filter(
          a =>
            a.attributes.format === "resource" ||
            a.attributes.format === "resource_collection"
        )
        .filter(a => a.attributes.readerDisplayFormat === "inline").length,
    [annotations]
  );

  const [resourceThumbs, setResourceThumbs] = useState({});

  const sorted = Object.keys(resourceThumbs).sort(
    (a, b) => resourceThumbs[a].top - resourceThumbs[b].top
  );

  const getOverlap = (target, positions) => {
    const { height, top } = target;
    const range = top + height + 20;
    const candidates = Object.keys(positions).filter(
      id => Math.abs(range - resourceThumbs[id].top) <= height + 20
    );
    return candidates?.length
      ? candidates.sort((a, b) => positions[a].top - positions[b].top)[0]
      : null;
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

  const dialog = useDialog({
    modal: true,
    scrollLockClassName: "no-scroll"
  });

  const [dialogResource, setDialogResource] = useState({
    id: null,
    type: "resource"
  });

  const openDialog = useCallback(
    props => {
      setDialogResource(props);
      dialog.onToggleClick();
    },
    [dialog]
  );

  return (
    <ResourceMarkerContext.Provider
      value={{
        groups,
        setResourceThumbs,
        thumbCount,
        openDialog
      }}
    >
      {children}
      <Dialog resource={dialogResource} {...dialog} />
    </ResourceMarkerContext.Provider>
  );
}
