import { useOutletContext } from "react-router-dom";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import { journalVolumesAPI } from "api";
import { useFetch, useListQueryParams } from "hooks";
import EntitiesList, {
  Button,
  JournalVolumeRow
} from "backend/components/list/EntitiesList";

export default function JournalVolumesContainer() {
  const { journal, refresh } = useOutletContext() || {};

  const closeUrl = lh.link("backendJournalVolumes", journal?.id);

  const { pagination } = useListQueryParams({ initSize: 10 });

  const { data, refresh: refreshVolumes, meta } = useFetch({
    request: [journalVolumesAPI.index, journal?.id, pagination],
    condition: !!journal?.id
  });

  const { t } = useTranslation();

  if (!data || !journal) return null;

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
        buttons={[
          <Button
            path={lh.link("backendJournalVolumeNew", journal.id)}
            type="add"
            text={t("volumes.add_button_label")}
            authorizedFor="journalVolume"
          />
        ]}
      />
      <OutletWithDrawer
        drawerProps={{
          lockScroll: "always",
          wide: true,
          lockScrollClickCloses: false,
          closeUrl
        }}
        context={{
          refresh,
          refreshVolumes,
          journal,
          closeUrl: lh.link("backendJournalVolumes", journal.id)
        }}
      />
    </Authorize>
  );
}
