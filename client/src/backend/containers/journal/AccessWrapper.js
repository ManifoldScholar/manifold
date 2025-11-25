import { useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import EntitlementsContainer from "backend/containers/entitlements";
import Authorize from "hoc/Authorize";
import Authorization from "helpers/authorization";
import Layout from "backend/components/layout";
import { useFromStore } from "hooks";
import Permissions from "./Permissions";

export default function JournalAccessWrapper() {
  const { journal } = useOutletContext() || {};

  const closeUrl = lh.link("backendJournalAccess", journal?.id);

  const authorization = new Authorization();
  const authentication = useFromStore({ path: "authentication" });

  const canGrantPermissions = authorization.authorizeAbility({
    authentication,
    entity: journal,
    ability: "managePermissions"
  });

  if (!journal) return null;

  return (
    <>
      <Authorize
        entity={journal}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendJournal", journal.id)}
      >
        {canGrantPermissions && <Permissions journal={journal} />}
        <Layout.BackendPanel flush={!canGrantPermissions}>
          <EntitlementsContainer.List entity={journal} />
        </Layout.BackendPanel>
      </Authorize>
      <OutletWithDrawer
        drawerProps={{ closeUrl, lockScroll: "always" }}
        context={{
          entity: journal,
          closeUrl
        }}
      />
    </>
  );
}

JournalAccessWrapper.displayName = "Journal.Access.Wrapper";
