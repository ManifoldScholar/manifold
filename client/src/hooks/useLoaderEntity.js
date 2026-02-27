import { useMatches } from "react-router";

export default function useLoaderEntity(type) {
  const matches = useMatches();
  let found = null;
  matches.some(match => {
    const data = match.data;
    if (!data) return false;
    if (data.type === type) {
      found = data;
      return true;
    }
    if (typeof data === "object") {
      const value = Object.values(data).find(v => v?.type === type);
      if (value) {
        found = value;
        return true;
      }
    }
    return false;
  });
  return found;
}
