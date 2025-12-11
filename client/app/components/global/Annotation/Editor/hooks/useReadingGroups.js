import { useEffect, useContext, useMemo } from "react";
import { ReaderContext } from "app/contexts";
import { useAuthentication } from "hooks";
import useLoaderEntity from "hooks/useLoaderEntity";

export default function useReadingGroups({ annotation }) {
  const readerContext = useContext(ReaderContext);
  const { currentUser, readingGroups } = useAuthentication();
  const dispatch = readerContext?.dispatch;
  const text = useLoaderEntity("texts");

  const currentAnnotatingReadingGroup =
    readerContext?.readingGroups?.currentAnnotatingReadingGroup;

  const canAccessReadingGroups =
    currentUser?.attributes.classAbilities.readingGroup.read;
  const canEngagePublicly = text?.attributes.abilities.engagePublicly;

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
      if (dispatch) {
        dispatch({
          type: "SET_ANNOTATING_READING_GROUP",
          payload: id
        });
      }
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
