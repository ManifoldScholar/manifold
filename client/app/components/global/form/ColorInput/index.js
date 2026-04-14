import { lazy, Suspense } from "react";

const ColorInput = lazy(() => import("./ColorInput"));

export default function LazyColorInput(props) {
  return (
    <Suspense fallback={null}>
      <ColorInput {...props} />
    </Suspense>
  );
}
