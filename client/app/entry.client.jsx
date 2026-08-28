import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { StyleSheetManager } from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import { shouldForwardProp } from "lib/styled-components/shouldForwardProp";

import "utils/i18n";

// React-router docs may recommend using StrictMode here
// @atlaskit/pragmatic-drag-and-drop is not compatible with StrictMode

startTransition(() => {
  hydrateRoot(
    document,
    <HelmetProvider>
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <HydratedRouter />
      </StyleSheetManager>
    </HelmetProvider>
  );
});
