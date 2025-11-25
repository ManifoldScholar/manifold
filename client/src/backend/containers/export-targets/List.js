import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { exportTargetsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import EntitiesList, {
  Button,
  ExportTargetRow
} from "backend/components/list/EntitiesList";
import { useFetch } from "hooks";

export default function ExportTargetsListContainer() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: exportTargets, meta: exportTargetsMeta, refresh } = useFetch({
    request: [exportTargetsAPI.index],
    options: { requestKey: requests.beExportTargets }
  });

  // Refetch when export targets are modified
  const previousModified = exportTargetsMeta?.modified;
  useEffect(() => {
    const currentModified = exportTargetsMeta?.modified;
    if (currentModified && currentModified !== previousModified) {
      refresh();
    }
  }, [exportTargetsMeta?.modified, previousModified, refresh]);

  if (!exportTargets) return null;

  const active = id || "";
  const drawerProps = {
    closeUrl: lh.link("backendSettingsExportTargets"),
    lockScroll: "always"
  };

  return (
    <>
      <OutletWithDrawer drawerProps={drawerProps} />
      <EntitiesList
        entityComponent={ExportTargetRow}
        entityComponentProps={{ active }}
        title={t("settings.export_targets.header")}
        titleStyle="bar"
        entities={exportTargets}
        unit={t("glossary.export_target", { count: exportTargets?.length })}
        buttons={[
          <Button
            path={lh.link("backendSettingsExportTargetsNew")}
            text={t("settings.export_targets.button_label")}
            authorizedFor="exportTarget"
            type="add"
          />
        ]}
      />
    </>
  );
}

ExportTargetsListContainer.displayName = "ExportTargets.List";
