import React, { useMemo } from "react";
import Authorize from "hoc/Authorize";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { journalsAPI } from "api";
import { withRouter } from "react-router-dom";
import { useFetch, usePaginationState } from "hooks";
import EntitiesList, {
  Button,
  JournalIssueRow
} from "backend/components/list/EntitiesList";

function JournalIssuesContainer({ refresh, journal, route }) {
  const closeUrl = lh.link("backendJournalIssues", journal.id);

  const [pagination, setPageNumber] = usePaginationState();

  const filters = useMemo(() => ({ withUpdateAbility: true }), []);

  const { data, refresh: refreshIssues, meta } = useFetch({
    request: [journalsAPI.journalIssues, journal.id, pagination, filters]
  });

  const { t } = useTranslation();

  if (!data) return null;

  return (
    <Authorize
      entity={journal}
      ability="read"
      failureNotification
      failureRedirect={lh.link("backendJournal", journal.id)}
    >
      <EntitiesList
        instructions={t("issues.instructions")}
        entityComponent={JournalIssueRow}
        entityComponentProps={{ journal }}
        title={t("issues.header")}
        titleStyle="bar"
        titleTag="h2"
        entities={data}
        unit={t("glossary.issue_truncated", {
          count: meta?.pagination?.totalCount || 0
        })}
        pagination={meta.pagination}
        showCount
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
        buttons={[
          <Button
            path={lh.link("backendJournalIssueNew", journal.id)}
            type="add"
            text={t("issues.add_button_label")}
            authorizedFor={journal}
            authorizedTo="update"
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
