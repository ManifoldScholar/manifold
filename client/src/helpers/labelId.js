import uniqueId from "lodash/uniqueId";

export default function labelId(prefix = "") {
  return uniqueId(prefix);
}
