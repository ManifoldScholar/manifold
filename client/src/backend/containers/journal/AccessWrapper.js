import React from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import EntitlementsContainer from "backend/containers/entitlements";
import Authorize from "hoc/Authorize";

export default function JournalAccessWrapper({ journal, route }) {
  const closeUrl = lh.link("backendJournalAccess", journal.id);

  return journal ? (
    <>
      <Authorize
        entity={journal}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendJournal", journal.id)}
      >
        <EntitlementsContainer.List entity={journal} />
      </Authorize>
      {childRoutes(route, {
        drawer: true,
        drawerProps: { closeUrl, lockScroll: "always" },
        childProps: {
          entity: journal,
          closeUrl
        }
      })}
    </>
  ) : null;
}

JournalAccessWrapper.displayName = "Journal.Access.Wrapper";

JournalAccessWrapper.propTypes = {
  journal: PropTypes.object,
  updateJournal: PropTypes.func,
  route: PropTypes.object
};
