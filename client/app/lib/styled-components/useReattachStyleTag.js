import { useLayoutEffect } from "react";
// eslint-disable-next-line camelcase
import { __PRIVATE__ as scPrivate } from "styled-components";

// Walk GroupedTag → underlying tag → <style> element. Shape isn't part of
// styled-components' public API, so check defensively.
function getStyleElement() {
  const tag = scPrivate?.mainSheet?.tag;
  return tag?.tag?.element ?? tag?.element ?? null;
}

// React's singleton <head> reconciliation evicts styled-components'
// imperatively-injected <style data-styled> tag whenever the component tree
// rooted at <html> remounts (e.g. switching between Root and ErrorBoundary).
// The element is detached but still holds all collected rules — re-append it
// before paint so styled-components-driven UI keeps its styles.
export default function useReattachStyleTag() {
  useLayoutEffect(() => {
    const element = getStyleElement();
    if (
      element instanceof HTMLStyleElement &&
      !document.head.contains(element)
    ) {
      document.head.appendChild(element);
    }
  });
}
