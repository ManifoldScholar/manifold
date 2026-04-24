import { useMatches } from "react-router";

export default function useLoaderCollection(type) {
  const matches = useMatches();
  let found;
  matches.some(match => {
    const { data } = match;
    if (!data || typeof data !== "object") return false;
    return Object.values(data).some(v => {
      if (Array.isArray(v) && v[0]?.type === type) {
        found = v;
        return true;
      }
      if (Array.isArray(v?.data) && v.data[0]?.type === type) {
        found = v.data;
        return true;
      }
      return false;
    });
  });
  return found || [];
}
