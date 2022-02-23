import { useSelector } from "react-redux";
import { requests } from "api";
import { select, meta, grab } from "utils/entityUtils";

export default function useFromStore(name, type, id) {
  const value = useSelector(state => {
    if (type === "select") return select(requests[name], state.entityStore);
    if (type === "meta") return meta(requests[name], state.entityStore);
    if (type === "grab") return grab(name, id, state.entityStore);
    return state[name];
  });

  return value;
}
