import { useReducer, useMemo } from "react";
import { Outlet, redirect } from "react-router";
import Layout from "reader/components/layout";
import Footers from "global/components/Footers";
import Header from "reader/components/Header";
import { textsAPI } from "api";
import { useBodyClass } from "hooks";
import { ReaderContext } from "app/contexts";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { SearchProvider } from "hooks/useSearch/context";
import { useAuthentication, useReaderLocationChange } from "hooks";
import { readerReducer, initialReaderState } from "app/contexts/readerReducer";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { ErrorBoundary } from "./ErrorBoundary";
import ReaderOverlay from "reader/components/ReaderOverlay";

export { ErrorBoundary };

export const loader = async ({ params, request, context }) => {
  const text = await loadEntity({
    context,
    fetchFn: () => textsAPI.show(params.textId)
  });

  const url = new URL(request.url);
  const isBaseRoute =
    url.pathname === `/read/${params.textId}` ||
    url.pathname === `/read/${params.textId}/`;
  if (isBaseRoute) {
    throw redirect(
      `/read/${params.textId}/section/${text.attributes.startTextSectionId}`
    );
  }

  return text;
};

export default function ReaderRoute({ loaderData: text }) {
  const { currentUser } = useAuthentication();

  const [readerState, dispatch] = useReducer(
    readerReducer,
    currentUser?.attributes?.persistentUi?.reader,
    persisted =>
      persisted
        ? readerReducer(initialReaderState, {
            type: "HYDRATE",
            payload: persisted
          })
        : initialReaderState
  );

  useReaderLocationChange(dispatch);

  const contextValue = useMemo(() => ({ ...readerState, dispatch }), [
    readerState
  ]);

  const { colorScheme, highContrast } = readerState.colors;
  const bodyClass = `reader scheme-${colorScheme || "light"} ${
    highContrast ? "high-contrast" : ""
  }`;

  useBodyClass(bodyClass);

  return (
    <ReaderContext.Provider value={contextValue}>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={text} />
      <SearchProvider>
        <Header />
        <ReaderOverlay />
        <main
          id="skip-to-main"
          tabIndex={-1}
          className="main-content flex-viewport"
        >
          <Outlet context={text} />
        </main>
      </SearchProvider>
      <Footers.ReaderFooter text={text} />
      <Layout.PostFooter />
    </ReaderContext.Provider>
  );
}
