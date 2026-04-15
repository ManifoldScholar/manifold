import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import Layout from "backend/components/layout";
import { uiStateSnapshotActions } from "actions";
import lh from "helpers/linkHandler";
import BodyClass from "hoc/BodyClass";
import Authorize from "hoc/Authorize";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import AppFatalError from "global/components/FatalError/AppWrapper";

export default function BackendContainer() {
  const dispatch = useDispatch();

  const fatalError = useSelector(state => state.fatalError);

  useEffect(() => {
    return () => {
      dispatch(uiStateSnapshotActions.resetSnapshots());
    };
  }, [dispatch]);

  return (
    <BodyClass className={"backend bg-neutral90"}>
      <>
        <Utility.ScrollToTop />
        <Layout.GlobalHeader />
        <Authorize
          kind={[
            "admin",
            "editor",
            "marketeer",
            "project_creator",
            "project_editor",
            "project_property_manager",
            "journal_editor"
          ]}
          failureRedirect={lh.link("frontendLogin")}
          failureNotification
        >
          <BreadcrumbsProvider>
            <div className="main-content">
              {fatalError.error ? (
                <AppFatalError fatalError={fatalError} />
              ) : (
                <Outlet />
              )}
            </div>
          </BreadcrumbsProvider>
        </Authorize>
        <Footers.FrontendFooter withVersion />
      </>
    </BodyClass>
  );
}

BackendContainer.displayName = "Backend.Containers.Backend";
