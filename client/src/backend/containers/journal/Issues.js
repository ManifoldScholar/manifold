import React from "react";
import Authorize from "hoc/Authorize";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { journalIssuesAPI } from "api";
import { withRouter } from "react-router-dom";
import { useFetch, usePaginationState } from "hooks";
import EntitiesList, {
  Button,
  JournalIssueRow
} from "backend/components/list/EntitiesList";

function JournalIssuesContainer({ refresh, journal, route }) {
  const closeUrl = lh.link("backendJournalIssues", journal.id);

  const [pagination, setPageNumber] = usePaginationState();

  const { data, refresh: refreshIssues, meta } = useFetch({
    request: [journalIssuesAPI.index, journal.id, pagination]
  });

  if (!data) return null;

  return (
    <Authorize
      entity={journal}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendJournal", journal.id)}
    >
      <EntitiesList
        instructions="Manage the journal's issues from this screen. Each issue references a Manifold project, which is the container for the issue's content."
        entityComponent={JournalIssueRow}
        entityComponentProps={{ journal }}
        title={"Manage Issues"}
        titleIcon="Journals64"
        titleStyle="bar"
        entities={data}
        unit="issue"
        pagination={meta.pagination}
        showCount
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
        buttons={[
          <Button
            path={lh.link("backendJournalIssueNew", journal.id)}
            type="add"
            text="Create a new issue"
            authorizedFor="journalIssue"
          />
        ]}
      />
      {childRoutes(route, {
        drawer: true,
        drawerProps: {
          lockScroll: "always",
          wide: true,
          lockScrollClickCloses: false,
          closeUrl
        },
        childProps: {
          refresh,
          refreshIssues,
          journal,
          closeUrl: lh.link("backendJournalIssues", journal.id)
        }
      })}
    </Authorize>
  );
}

JournalIssuesContainer.propTypes = {
  journal: PropTypes.object
};

export default withRouter(JournalIssuesContainer);
