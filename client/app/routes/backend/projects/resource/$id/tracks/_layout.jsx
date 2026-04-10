import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import textTracksAPI from "api/resources/textTracks";
import EntitiesList, {
  Button,
  TextTrackRow
} from "backend/components/list/EntitiesList";
import { useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import { useRevalidator } from "react-router";
import PageHeader from "backend/components/layout/PageHeader";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import Dialog from "global/components/dialog";
import { queryApi } from "app/routes/utility/helpers/queryApi";

export const loader = async ({ params, context }) => {
  const response = await queryApi(textTracksAPI.index(params.id), context);
  return response?.data ?? [];
};

export default function TracksLayout({ loaderData: tracks }) {
  const { t } = useTranslation();
  const resource = useOutletContext();
  const { confirm, confirmation } = useConfirmation();
  const { revalidate } = useRevalidator();
  const { addNotification } = useNotifications();

  const destroyTrack = useApiCallback(id => {
    return textTracksAPI.destroy(resource.id, id);
  });

  const onDelete = id => {
    confirm({
      heading: t("modals.delete_track"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroyTrack(id);
          revalidate();
          closeDialog();
        } catch {
          closeDialog();
          addNotification({
            level: 2,
            id: `TEXT_TRACK_DESTROY_FAILED_${id}`,
            heading: t("notifications.delete_failure", {
              entity: "text track"
            }),
            body: t("notifications.delete_failure_body"),
            expiration: 5000
          });
        }
      }
    });
  };

  const closeUrl = `/backend/projects/resource/${resource.id}/tracks`;

  const drawerProps = {
    lockScroll: "always",
    closeUrl
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawers drawerProps={drawerProps} context={resource} />
      <PageHeader type="list" title={t("titles.tracks")} hideBreadcrumbs />
      {!!tracks && (
        <EntitiesList
          entityComponent={TextTrackRow}
          entityComponentProps={{ onDelete, resourceId: resource.id }}
          entities={tracks}
          instructions={t("records.tracks.instructions")}
          buttons={[
            <Button
              path={`/backend/projects/resource/${resource.id}/tracks/new`}
              text={t("records.tracks.button_label")}
              authorizedFor="textTrack"
              type="add"
            />
          ]}
        />
      )}
    </>
  );
}
