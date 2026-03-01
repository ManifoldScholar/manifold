import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";
import Footers from "global/components/Footers";
import Layout from "backend/components/layout";
import { uiStateSnapshotActions } from "actions";
import BodyClass from "hoc/BodyClass";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
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
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(uiStateSnapshotActions.resetSnapshots());
    };
  }, [dispatch]);

  return (
    <BodyClass className="backend bg-neutral90">
      <Layout.GlobalHeader />
      <BreadcrumbsProvider>
        <div className="main-content">
          <Outlet />
        </div>
      </BreadcrumbsProvider>
      <Footers.FrontendFooter withVersion />
    </BodyClass>
  );
}
