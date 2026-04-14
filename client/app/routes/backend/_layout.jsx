import { Outlet } from "react-router";
import Footers from "components/global/Footers";
import Layout from "components/backend/layout";
import { useBodyClass } from "hooks";
import { BreadcrumbsProvider } from "components/global/atomic/Breadcrumbs";
import { useScrollToTop } from "hooks";
import authorize from "app/routes/utility/loaders/authorize";
import { ErrorBoundary } from "./ErrorBoundary";

const ADMIN_ROLES = [
  "admin",
  "editor",
  "marketeer",
  "project_creator",
  "project_editor",
  "project_property_manager",
  "journal_editor"
];

export const loader = async ({ request, context }) => {
  await authorize({ request, context, kind: ADMIN_ROLES });
  return null;
};

export { ErrorBoundary };

export default function BackendLayout() {
  useScrollToTop();
  useBodyClass("backend bg-neutral90");

  return (
    <>
      <Layout.GlobalHeader />
      <BreadcrumbsProvider>
        <div className="main-content bg-neutral90">
          <Outlet />
        </div>
      </BreadcrumbsProvider>
      <Footers.FrontendFooter withVersion />
    </>
  );
}
