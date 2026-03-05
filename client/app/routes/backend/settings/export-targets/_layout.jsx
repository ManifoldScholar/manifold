import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { exportTargetsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import EntitiesList, {
  Button,
  ExportTargetRow
} from "backend/components/list/EntitiesList";

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: exportTargetsAPI.index,
    options: { skipPagination: true }
  });
};

export default function SettingsExportTargetsLayout({ loaderData }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: exportTargets } = loaderData;

  const drawerProps = {
    closeUrl: "/backend/settings/export-targets",
    lockScroll: "always"
  };

  return (
    <>
      <OutletWithDrawer drawerProps={drawerProps} />
      {exportTargets && (
        <EntitiesList
          entityComponent={ExportTargetRow}
          entityComponentProps={{ active: id }}
          title={t("settings.export_targets.header")}
          titleStyle="bar"
          entities={exportTargets}
          unit={t("glossary.export_target", {
            count: exportTargets?.length
          })}
          buttons={[
            <Button
              path="/backend/settings/export-targets/new"
              text={t("settings.export_targets.button_label")}
              authorizedFor="exportTarget"
              type="add"
            />
          ]}
        />
      )}
    </>
  );
}
