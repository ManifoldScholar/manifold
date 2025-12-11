import { Outlet } from "react-router";
import classNames from "classnames";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import Layout from "frontend/components/layout";
import { useSettings, useBodyClass } from "hooks";
import get from "lodash/get";
import { SearchProvider } from "hooks/useSearch/context";

export default function FrontendLayout() {
  useBodyClass("browse");

  const settings = useSettings();
  const hasPressLogo = get(settings, "attributes.pressLogoStyles.small");

  return (
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
  );
}
