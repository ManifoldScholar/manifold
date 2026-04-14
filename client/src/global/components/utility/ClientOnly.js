import { useHasMounted } from "hooks";

export default function ClientOnly({ children, fallback = null }) {
  const hasMounted = useHasMounted();
  if (!hasMounted) return fallback;
  return typeof children === "function" ? children() : children;
}
