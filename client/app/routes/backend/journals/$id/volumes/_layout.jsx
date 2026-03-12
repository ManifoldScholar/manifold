import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router";
import { journalVolumesAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import EntitiesList, {
  Button,
  JournalVolumeRow
} from "backend/components/list/EntitiesList";

export const loader = async ({ request, context, params }) => {
  return loadList({
    request,
    context,
    fetchFn: (_filters, pagination) =>
      journalVolumesAPI.index(params.id, pagination),
    options: {
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function JournalVolumesLayout({ loaderData }) {
  const { t } = useTranslation();
  const journal = useOutletContext();
  const { volumeId } = useParams();

  const closeUrl = `/backend/journals/${journal.id}/volumes`;
  const { data: volumes, meta } = loaderData;

  return (
    <>
      <OutletWithDrawer
        drawerProps={{
          closeUrl,
          lockScroll: "always",
          wide: true,
          lockScrollClickCloses: false
        }}
      />
      <EntitiesList
        entityComponent={JournalVolumeRow}
        entityComponentProps={{ journal, active: volumeId }}
        title={t("volumes.header")}
        titleStyle="bar"
        titleTag="h2"
        entities={volumes}
        unit={t("glossary.volume", {
          count: meta?.pagination?.totalCount || 0
        })}
        pagination={meta?.pagination}
        showCount
        buttons={[
          <Button
            key="new"
            path={`/backend/journals/${journal.id}/volumes/new`}
            type="add"
            text={t("volumes.add_button_label")}
            authorizedFor="journalVolume"
          />
        ]}
      />
    </>
  );
}
