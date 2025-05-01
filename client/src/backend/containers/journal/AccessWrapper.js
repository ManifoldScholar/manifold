import React from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import EntitlementsContainer from "backend/containers/entitlements";
import Authorize from "hoc/Authorize";
import Authorization from "helpers/authorization";
import Layout from "backend/components/layout";
import { useFromStore } from "hooks";
import Permissions from "./Permissions";

export default function JournalAccessWrapper({ journal, route }) {
  const closeUrl = lh.link("backendJournalAccess", journal.id);

  const authorization = new Authorization();
  const authentication = useFromStore("authentication");

  const canGrantPermissions = authorization.authorizeAbility({
    authentication,
    entity: journal,
    ability: "managePermissions",
  });

  return journal ? (
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
      {childRoutes(route, {
        drawer: true,
        drawerProps: { closeUrl, lockScroll: "always" },
        childProps: {
          entity: journal,
          closeUrl,
        },
      })}
    </>
  ) : null;
}

JournalAccessWrapper.displayName = "Journal.Access.Wrapper";

JournalAccessWrapper.propTypes = {
  journal: PropTypes.object,
  route: PropTypes.object,
};
