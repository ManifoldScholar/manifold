import { useContext, useMemo, useEffect, useRef, useCallback } from "react";
import { ReaderContext } from "app/contexts";
import useAuthentication from "hooks/useAuthentication";
import useLoaderEntity from "hooks/useLoaderEntity";
import { isEqual } from "lodash-es";

const DEFAULT_ANNOTATING_GROUP = "private";

export default function useReadingGroups() {
  const context = useContext(ReaderContext);
  const dispatch = context?.dispatch;
  const text = useLoaderEntity("texts");
  const {
    currentUser,
    readingGroups: readingGroupEntities
  } = useAuthentication();

  // Reading group selection state: from context when available, defaults otherwise
  const {
    currentAnnotatingReadingGroup,
    currentAnnotationOverlayReadingGroup
  } = context?.readingGroups ?? {
    currentAnnotatingReadingGroup: DEFAULT_ANNOTATING_GROUP,
    currentAnnotationOverlayReadingGroup: "me"
  };

  // When this hook is used outside of the reader context, we won't have access
  // to project abilities. In that case, we'll assume that public engagement is
  // possible, matching the HOC's original behavior.
  const canEngagePublicly = text
    ? text.attributes.abilities.engagePublicly
    : true;

  const canAccessReadingGroups =
    currentUser?.attributes?.classAbilities?.readingGroup?.read;

  const adjustedReadingGroups = useMemo(() => {
    if (!readingGroupEntities?.length) return [];
    if (canEngagePublicly) return readingGroupEntities;
    return readingGroupEntities.filter(
      rg =>
        rg.attributes.privacy === "private" ||
        rg.attributes.privacy === "anonymous"
    );
  }, [readingGroupEntities, canEngagePublicly]);

  const validatedCurrentReadingGroup = useMemo(() => {
    if (currentAnnotatingReadingGroup === "public" && canEngagePublicly)
      return currentAnnotatingReadingGroup;
    if (currentAnnotatingReadingGroup === "private")
      return currentAnnotatingReadingGroup;

    const validGroup = adjustedReadingGroups.find(
      group => group.id === currentAnnotatingReadingGroup
    );
    if (validGroup) return currentAnnotatingReadingGroup;
    return DEFAULT_ANNOTATING_GROUP;
  }, [currentAnnotatingReadingGroup, canEngagePublicly, adjustedReadingGroups]);

  const validatedOverlay = useMemo(() => {
    if (
      currentAnnotationOverlayReadingGroup === "me" ||
      currentAnnotationOverlayReadingGroup === "orphaned"
    )
      return currentAnnotationOverlayReadingGroup;

    const validOverlay = adjustedReadingGroups.find(
      group => group.id === currentAnnotationOverlayReadingGroup
    );
    if (validOverlay) return currentAnnotationOverlayReadingGroup;
    return "me";
  }, [currentAnnotationOverlayReadingGroup, adjustedReadingGroups]);

  // Auto-reset: when reading groups change, reset invalid selection to default
  const prevGroupIdsRef = useRef(null);
  useEffect(() => {
    if (!context) return; // Only auto-reset in reader context
    const groupIds = adjustedReadingGroups.map(rg => rg.id);
    if (prevGroupIdsRef.current === null) {
      prevGroupIdsRef.current = groupIds;
      return;
    }
    if (isEqual(groupIds, prevGroupIdsRef.current)) return;
    prevGroupIdsRef.current = groupIds;

    if (!currentAnnotatingReadingGroup) return;

    const currentGroup = adjustedReadingGroups.find(
      group => group.id === currentAnnotatingReadingGroup
    );
    if (currentGroup) return;
    if (currentAnnotatingReadingGroup === DEFAULT_ANNOTATING_GROUP) return;

    if (dispatch)
      dispatch({
        type: "SET_ANNOTATING_READING_GROUP",
        payload: DEFAULT_ANNOTATING_GROUP
      });
  }, [context, adjustedReadingGroups, currentAnnotatingReadingGroup, dispatch]);

  // Reset invalid overlay reading group
  useEffect(() => {
    if (!context) return; // Only auto-reset in reader context
    if (
      currentAnnotationOverlayReadingGroup === "me" ||
      currentAnnotationOverlayReadingGroup === "orphaned"
    )
      return;
    if (!adjustedReadingGroups.length) return;

    const validOverlay = adjustedReadingGroups.find(
      group => group.id === currentAnnotationOverlayReadingGroup
    );
    if (validOverlay) return;

    if (dispatch)
      dispatch({
        type: "SET_ANNOTATION_OVERLAY_READING_GROUP",
        payload: "me"
      });
  }, [
    context,
    currentAnnotationOverlayReadingGroup,
    adjustedReadingGroups,
    dispatch
  ]);

  const setAnnotatingReadingGroup = useCallback(
    id => {
      if (dispatch)
        dispatch({ type: "SET_ANNOTATING_READING_GROUP", payload: id });
    },
    [dispatch]
  );

  const setAnnotationOverlayReadingGroup = useCallback(
    id => {
      if (dispatch)
        dispatch({
          type: "SET_ANNOTATION_OVERLAY_READING_GROUP",
          payload: id
        });
    },
    [dispatch]
  );

  const currentAnnotationStyle = useMemo(() => {
    if (
      validatedCurrentReadingGroup === "private" ||
      validatedCurrentReadingGroup === "public"
    )
      return "solid";
    const activeGroup = adjustedReadingGroups.find(
      rg => rg.id === validatedCurrentReadingGroup
    );
    return (
      activeGroup?.relationships?.currentUserReadingGroupMembership?.attributes
        ?.annotationStyle ?? "solid"
    );
  }, [validatedCurrentReadingGroup, adjustedReadingGroups]);

  return {
    readingGroups: adjustedReadingGroups,
    canEngagePublicly,
    canAccessReadingGroups,
    currentAnnotatingReadingGroup: validatedCurrentReadingGroup,
    currentAnnotationOverlayReadingGroup: validatedOverlay,
    currentAnnotationStyle,
    setAnnotatingReadingGroup,
    setAnnotationOverlayReadingGroup
  };
}
