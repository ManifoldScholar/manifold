import { useMemo } from "react";
import { Outlet } from "react-router";
import classNames from "classnames";
import { subjectsAPI } from "api";
import { FrontendContext } from "app/contexts";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import Layout from "frontend/components/layout";
import { useSettings, useBodyClass, useFromStore } from "hooks";
import get from "lodash/get";
import { SearchProvider } from "hooks/useSearch/context";
import { ErrorBoundary } from "./ErrorBoundary";

export const shouldRevalidate = false;

const SUBJECT_FILTERS = { used: true };
const JOURNAL_SUBJECT_FILTERS = { usedJournal: true };

// Loader fetches subjects once for all frontend routes
export const loader = async ({ context }) => {
  const results = await loadParallelLists({
    context,
    fetchFns: {
      subjects: () => subjectsAPI.index(SUBJECT_FILTERS, null, true),
      journalSubjects: () =>
        subjectsAPI.index(JOURNAL_SUBJECT_FILTERS, null, true)
    }
  });

  return {
    subjects: results.subjects ?? [],
    journalSubjects: results.journalSubjects ?? []
  };
};

export { ErrorBoundary };

export default function FrontendLayout({ loaderData }) {
  useBodyClass("browse");

  const settings = useSettings();
  const hasPressLogo = get(settings, "attributes.pressLogoStyles.small");
  const frontendMode = useFromStore({ path: "ui.transitory.frontendMode" });

  const frontendContextValue = useMemo(
    () => ({
      subjects: loaderData?.subjects ?? [],
      journalSubjects: loaderData?.journalSubjects ?? [],
      frontendMode: frontendMode ?? {}
    }),
    [loaderData?.subjects, loaderData?.journalSubjects, frontendMode]
  );

  return (
    <FrontendContext.Provider value={frontendContextValue}>
      <BreadcrumbsProvider>
        <Utility.ScrollToTop />
        <SearchProvider>
          <Layout.Header />
          <main
            id="skip-to-main"
            tabIndex={-1}
            className={classNames({
              "main-content": true,
              "flex-viewport": true,
              "extra-top": hasPressLogo
            })}
          >
            <Outlet />
          </main>
          <Footers.FrontendFooter />
        </SearchProvider>
      </BreadcrumbsProvider>
    </FrontendContext.Provider>
  );
}
