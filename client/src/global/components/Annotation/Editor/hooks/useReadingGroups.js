import { useEffect, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiReadingGroupActions } from "actions";
import { ReaderContext } from "helpers/contexts";
import { useCurrentUser } from "hooks";
import get from "lodash/get";

export default function useReadingGroups({ annotation, readingGroups }) {
  const readerContext = useContext(ReaderContext);
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  const currentAnnotatingReadingGroup = useSelector(state =>
    get(
      state,
      "ui.persistent.reader.readingGroups.currentAnnotatingReadingGroup"
    )
  );

  const canAccessReadingGroups =
    currentUser?.attributes.classAbilities.readingGroup.read;
  const canEngagePublicly = readerContext?.attributes.abilities.engagePublicly;

  const shouldShowReadingGroups = readerContext
    ? canAccessReadingGroups || canEngagePublicly
    : false;

  const adjustedReadingGroups = useMemo(() => {
    if (!readingGroups) return [];
    if (canEngagePublicly) return readingGroups;
    return readingGroups.filter(
      rg =>
        rg.attributes.privacy === "private" ||
        rg.attributes.privacy === "anonymous"
    );
  }, [readingGroups, canEngagePublicly]);

  const currentGroupId = (() => {
    if (currentAnnotatingReadingGroup === "public" && canEngagePublicly)
      return currentAnnotatingReadingGroup;
    if (currentAnnotatingReadingGroup === "private")
      return currentAnnotatingReadingGroup;

    const validGroup = adjustedReadingGroups.find(
      group => group.id === currentAnnotatingReadingGroup
    );
    if (validGroup) return currentAnnotatingReadingGroup;
    return "private";
  })();

  const currentGroupData = useMemo(() => {
    if (
      currentGroupId === "public" ||
      currentGroupId === "private" ||
      !currentGroupId
    )
      return null;

    return adjustedReadingGroups.find(group => group.id === currentGroupId);
  }, [currentGroupId, adjustedReadingGroups]);

  useEffect(() => {
    if (!shouldShowReadingGroups) return;
    if (!annotation.id) return;

    const setReadingGroup = id => {
      dispatch(uiReadingGroupActions.setAnnotatingReadingGroup(id));
    };

    if (annotation.attributes.readingGroupId) {
      setReadingGroup(annotation.attributes.readingGroupId);
    } else if (annotation.attributes.private) {
      setReadingGroup("private");
    } else {
      setReadingGroup("public");
    }
  }, [
    annotation.id,
    annotation.attributes.readingGroupId,
    annotation.attributes.private,
    shouldShowReadingGroups,
    dispatch
  ]);

  return {
    adjustedReadingGroups,
    shouldShowReadingGroups,
    canAccessReadingGroups,
    canEngagePublicly,
    currentGroupId,
    currentGroupData
  };
}
