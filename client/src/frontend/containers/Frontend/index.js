import { useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import Layout from "frontend/components/layout";
import { commonActions } from "actions/helpers";
import { pagesAPI, subjectsAPI, requests } from "api";
import { useFetch, useFromStore } from "hooks";
import { Outlet } from "react-router-dom";
import get from "lodash/get";
import BodyClass from "hoc/BodyClass";
import AppFatalError from "global/components/FatalError/AppWrapper";
import redirectIfLibraryDisabled from "hoc/redirectIfLibraryDisabled";
import { SearchProvider } from "hooks/useSearch/context";

function FrontendContainer() {
  const dispatch = useDispatch();

  const authentication = useFromStore({ path: "authentication" });
  const visibility = useFromStore({ path: "ui.transitory.visibility" });
  const notifications = useFromStore({ path: "notifications" });
  const fatalError = useFromStore({ path: "fatalError" });

  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });

  const userId = authentication.currentUser?.id;

  const { data: pages } = useFetch({
    request: [pagesAPI.index],
    options: { requestKey: requests.gPages },
    dependencies: [userId]
  });

  // Memoize filter objects to prevent infinite fetch loops
  const subjectFilters = useMemo(() => ({ used: true }), []);
  const journalSubjectFilters = useMemo(() => ({ usedJournal: true }), []);

  useFetch({
    request: [subjectsAPI.index, subjectFilters, null, true],
    options: { requestKey: requests.feSubjects },
    dependencies: [userId]
  });

  useFetch({
    request: [subjectsAPI.index, journalSubjectFilters, null, true],
    options: { requestKey: requests.feJournalSubjects },
    dependencies: [userId]
  });

  const commonActionsMemo = useMemo(() => commonActions(dispatch), [dispatch]);

  const mainClassName = useMemo(() => {
    const hasPressLogo = get(settings, "attributes.pressLogoStyles.small");
    return classNames({
      "main-content": true,
      "flex-viewport": true,
      "extra-top": hasPressLogo
    });
  }, [settings]);

  return (
    <BodyClass className="browse">
      <BreadcrumbsProvider>
        <Utility.ScrollToTop />
        <SearchProvider>
          <Layout.Header
            pages={pages}
            visibility={visibility}
            authentication={authentication}
            notifications={notifications}
            commonActions={commonActionsMemo}
            settings={settings}
          />
          <main id="skip-to-main" tabIndex={-1} className={mainClassName}>
            {fatalError.error ? (
              <AppFatalError fatalError={fatalError} />
            ) : (
              <Outlet />
            )}
          </main>
          <Footers.FrontendFooter
            pages={pages}
            authentication={authentication}
            commonActions={commonActionsMemo}
            settings={settings}
          />
        </SearchProvider>
      </BreadcrumbsProvider>
    </BodyClass>
  );
}

FrontendContainer.propTypes = {};

export default redirectIfLibraryDisabled(FrontendContainer);
