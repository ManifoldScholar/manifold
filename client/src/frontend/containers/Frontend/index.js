import classNames from "classnames";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import Layout from "frontend/components/layout";
import { requests } from "api";
import { useFromStore } from "hooks";
import { Outlet } from "react-router";
import get from "lodash/get";
import BodyClass from "hoc/BodyClass";
import AppFatalError from "global/components/FatalError/AppWrapper";
import redirectIfLibraryDisabled from "hoc/redirectIfLibraryDisabled";
import { SearchProvider } from "hooks/useSearch/context";

function FrontendContainer() {
  const fatalError = useFromStore({ path: "fatalError" });

  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select"
  });

  const hasPressLogo = get(settings, "attributes.pressLogoStyles.small");

  return (
    <BodyClass className="browse">
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
            {fatalError.error ? (
              <AppFatalError fatalError={fatalError} />
            ) : (
              <Outlet />
            )}
          </main>
          <Footers.FrontendFooter />
        </SearchProvider>
      </BreadcrumbsProvider>
    </BodyClass>
  );
}

FrontendContainer.propTypes = {};

export default redirectIfLibraryDisabled(FrontendContainer);
