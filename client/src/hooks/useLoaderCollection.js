import { useMatches } from "react-router";

export default function useLoaderCollection(type) {
  const matches = useMatches();
  let found;
  matches.some(match => {
    const { data } = match;
    if (!data || typeof data !== "object") return false;
    found = Object.values(data).find(
      v => Array.isArray(v) && v.length > 0 && v[0]?.type === type
    );
    return !!found;
  });
  return found || [];
}
