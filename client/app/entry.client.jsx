import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import createStore from "store/createStore";
import { setStore } from "store/storeInstance";
import { createEmotionCache } from "./utils/emotion-stream";

import "utils/i18n";

const store = createStore();
setStore(store);

const cache = createEmotionCache();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <Provider store={store}>
        <CacheProvider value={cache}>
          <HydratedRouter />
        </CacheProvider>
      </Provider>
    </StrictMode>
  );
});
