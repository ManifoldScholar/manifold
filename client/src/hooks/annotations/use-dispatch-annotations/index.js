import { useEffect } from "react";
import { useDispatch } from "react-redux";
import omitBy from "lodash/omitBy";
import { meAPI, readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { getRequestName } from "../helpers";

const { request } = entityStoreActions;

export default function useDispatchAnnotations(
  filters,
  page,
  groupId,
  context,
  filtered,
  fetchVersion
) {
  const dispatch = useDispatch();
  const groupType = groupId === "me" ? "me" : "group";
  const requestName = getRequestName(groupType, context, filtered);
  const activeFilters = omitBy(filters, value => value === "");

  useEffect(() => {
    const annotationsFetch =
      groupType === "me"
        ? meAPI.annotations(activeFilters, page)
        : readingGroupsAPI.annotations(groupId, activeFilters, page);
    const annotationsAction = request(annotationsFetch, requests[requestName]);
    dispatch(annotationsAction);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    dispatch,
    JSON.stringify(filters),
    JSON.stringify(page),
    groupId,
    context,
    filtered,
    fetchVersion
  ]);
}
