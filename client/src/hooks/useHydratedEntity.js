import { useSelector } from "react-redux";
import { grab } from "utils/entityUtils";

export default function useHydratedEntity(type, id) {
  return useSelector(state => {
    return grab(type, id, state.entityStore, true);
  });
}
