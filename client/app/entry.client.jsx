import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "lib/react-router/emotion-stream";

import "utils/i18n";

const cache = createEmotionCache();

// React-router docs may recommend using StrictMode here
// @atlaskit/pragmatic-drag-and-drop is not compatible with StrictMode

startTransition(() => {
  hydrateRoot(
    document,
    <CacheProvider value={cache}>
      <HydratedRouter />
    </CacheProvider>
  );
});
