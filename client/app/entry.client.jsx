import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { Provider } from "react-redux";
import createStore from "store/createStore";
import { setStore } from "store/storeInstance";

import "utils/i18n";

// Create store for client
// Middleware handles user/settings via context, so no bootstrap needed
const store = createStore();
setStore(store);

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <Provider store={store}>
        <HydratedRouter />
      </Provider>
    </StrictMode>
  );
});
