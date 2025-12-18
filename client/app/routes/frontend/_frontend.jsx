import { useMemo } from "react";
import { Outlet } from "react-router";
import classNames from "classnames";
import { ApiClient, subjectsAPI } from "api";
import { routerContext, FrontendContext } from "app/contexts";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import Layout from "frontend/components/layout";
import { useSettings, useBodyClass, useFromStore } from "hooks";
import get from "lodash/get";
import { SearchProvider } from "hooks/useSearch/context";

// Only revalidate on form actions, not navigation
// Subjects don't change during a session
export const shouldRevalidate = ({ formAction, defaultShouldRevalidate }) => {
  if (formAction) return defaultShouldRevalidate;
  return false;
};

const SUBJECT_FILTERS = { used: true };
const JOURNAL_SUBJECT_FILTERS = { usedJournal: true };

// Loader fetches subjects once for all frontend routes
export const loader = async ({ context }) => {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const [subjectsResult, journalSubjectsResult] = await Promise.allSettled([
    client.call(subjectsAPI.index(SUBJECT_FILTERS, null, true)),
    client.call(subjectsAPI.index(JOURNAL_SUBJECT_FILTERS, null, true))
  ]);

  return {
    subjects: subjectsResult.status === "fulfilled" ? subjectsResult.value : [],
    journalSubjects:
      journalSubjectsResult.status === "fulfilled"
        ? journalSubjectsResult.value
        : []
  };
};

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
