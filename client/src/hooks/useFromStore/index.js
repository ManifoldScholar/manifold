import { useSelector } from "react-redux";
import { select, meta, grab } from "utils/entityUtils";
import get from "lodash/get";

export default function useFromStore({
  requestKey,
  action,
  id,
  entityType,
  path,
  allowPartial
}) {
  return useSelector(state => {
    if (!action && !path) return null;
    if (path) return get(state, path);

    switch (action) {
      case "select":
        return select(requestKey, state.entityStore);
      case "meta":
        return meta(requestKey, state.entityStore);
      case "grab":
        return grab(entityType, id, state.entityStore, allowPartial);
      default:
        return null;
    }
  });
}
