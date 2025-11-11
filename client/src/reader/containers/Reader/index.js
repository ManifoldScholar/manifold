import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate, Outlet } from "react-router-dom";
import Overlay from "global/components/Overlay";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import TextMeta from "reader/components/TextMeta";
import Layout from "reader/components/layout";
import Toc from "reader/components/Toc";
import Footers from "global/components/Footers";
import Header from "reader/components/Header";
import ReaderFullNotes from "reader/containers/ReaderFullNotes";
import { textsAPI, requests, meAPI } from "api";
import locationHelper from "helpers/location";
import { setPersistentUI } from "actions/ui/persistentUi";
import ScrollAware from "hoc/ScrollAware";
import BodyClass from "hoc/BodyClass";
import Authorize from "hoc/Authorize";
import { ReaderContext } from "helpers/contexts";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import AppFatalError from "global/components/FatalError/AppWrapper";
import { SearchProvider } from "hooks/useSearch/context";
import { useFetch, useFromStore } from "hooks";

export default function ReaderContainer() {
  const { textId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [showMeta, setShowMeta] = useState(false);
  const prevLocationRef = useRef(location);

  const { data: text } = useFetch({
    request: [textsAPI.show, textId],
    condition: !!textId,
    refetchOnLogin: true
  });

  const authentication = useFromStore({ path: "authentication" });
  const fatalError = useFromStore({ path: "fatalError" });
  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });
  const appearance = useFromStore({ path: "ui.persistent.reader" });

  const currentUserId = authentication?.currentUser?.id;

  useFetch({
    request: [meAPI.readingGroups],
    condition:
      !!currentUserId &&
      settings?.attributes?.general?.disableReadingGroups === false
  });

  const hasSetPersistentUIRef = useRef(false);

  useEffect(() => {
    if (hasSetPersistentUIRef.current) return;
    const user = authentication?.currentUser;
    if (user?.attributes?.persistentUi?.reader) {
      setPersistentUI(user.attributes.persistentUi.reader);
      hasSetPersistentUIRef.current = true;
    }
  }, [authentication?.currentUser]);

  useEffect(() => {
    const prevLocation = prevLocationRef.current;
    if (locationHelper.triggersScrollToTop(location, prevLocation)) {
      window.scrollTo(0, 0);
    }
    prevLocationRef.current = location;
  }, [location]);

  const colorScheme = appearance?.colors?.colorScheme;
  const bodyClass = `reader scheme-${colorScheme || "light"} ${
    appearance?.colors?.highContrast ? "high-contrast" : ""
  }`;

  const renderOverlay = () => {
    if (showMeta && text) {
      return (
        <Overlay
          open
          closeCallback={() => setShowMeta(false)}
          appearance="overlay-full"
        >
          <TextMeta
            title={text.attributes.titlePlaintext}
            subtitle={text.attributes.subtitle}
            meta={text.attributes.metadataFormatted}
          />
        </Overlay>
      );
    }
    if (location.hash === "#group-annotations") {
      return (
        <Authorize kind="any">
          <ReaderFullNotes text={text} closeCallback={() => navigate(-1)} />
        </Authorize>
      );
    }
    return null;
  };

  return (
    <BodyClass className={bodyClass}>
      <ReaderContext.Provider value={text}>
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={text} />
        <CheckFrontendMode
          debugLabel="ReaderWrapper"
          project={text?.relationships?.project}
        />
        <SearchProvider>
          <ScrollAware>
            <Header text={text} />
          </ScrollAware>
          <Toc text={text} showMeta={() => setShowMeta(true)} />
          <main
            id="skip-to-main"
            tabIndex={-1}
            className="main-content flex-viewport"
          >
            {fatalError?.error ? (
              <AppFatalError fatalError={fatalError} />
            ) : (
              <>
                {renderOverlay()}
                <Outlet context={{ text }} />
              </>
            )}
          </main>
        </SearchProvider>
        <Footers.ReaderFooter text={text} />
        <Layout.PostFooter />
      </ReaderContext.Provider>
    </BodyClass>
  );
}

ReaderContainer.displayName = "Reader.Container";
