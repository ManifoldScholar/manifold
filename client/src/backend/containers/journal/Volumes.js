import React from "react";
import Authorize from "hoc/Authorize";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { journalVolumesAPI } from "api";
import { withRouter } from "react-router-dom";
import { useFetch, usePaginationState } from "hooks";
import EntitiesList, {
  Button,
  JournalVolumeRow
} from "backend/components/list/EntitiesList";

function JournalVolumesContainer({ refresh, journal, route }) {
  const closeUrl = lh.link("backendJournalVolumes", journal.id);

  const [pagination, setPageNumber] = usePaginationState();

  const { data, refresh: refreshVolumes, meta } = useFetch({
    request: [journalVolumesAPI.index, journal.id, pagination]
  });

  const { t } = useTranslation();

  if (!data) return null;

  return (
    <Authorize
      entity={journal}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendJournal", journal.id)}
    >
      <EntitiesList
        entityComponent={JournalVolumeRow}
        entityComponentProps={{ journal }}
        title={t("volumes.header")}
        titleStyle="bar"
        titleTag="h2"
        entities={data}
        unit={t("glossary.volume", {
          count: meta?.pagination?.totalCount || 0
        })}
        pagination={meta.pagination}
        showCount
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
        buttons={[
          <Button
            path={lh.link("backendJournalVolumeNew", journal.id)}
            type="add"
            text={t("volumes.add_button_label")}
            authorizedFor="journalVolume"
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
          refreshVolumes,
          journal,
          closeUrl: lh.link("backendJournalVolumes", journal.id)
        }
      })}
    </Authorize>
  );
}

JournalVolumesContainer.propTypes = {
  journal: PropTypes.object
};

export default withRouter(JournalVolumesContainer);
