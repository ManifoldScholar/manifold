import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate, useParams } from "react-router";
import { journalVolumesAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { useApiCallback, useConfirmation, useNotifications } from "hooks";
import Volume from "backend/components/volume";
import Layout from "backend/components/layout";
import Dialog from "global/components/dialog";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => journalVolumesAPI.show(params.volumeId),
    request
  });
};

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      journalVolumesAPI.update(params.volumeId, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function JournalVolumeEdit({ loaderData: volume }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const destroy = useApiCallback(journalVolumesAPI.destroy);

  const handleDelete = () => {
    confirm({
      heading: t("modals.delete_volume"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroy(volume.id);
          navigate(`/backend/journals/${id}/volumes`);
          addNotification({
            level: 0,
            id: `JOURNAL_VOLUME_DESTROYED_${volume.id}`,
            heading: t("notifications.volume_delete"),
            body: t("notifications.volume_body", {
              number: volume?.attributes?.number
            }),
            expiration: 5000
          });
        } catch {
          closeDialog();
        }
      }
    });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <section>
        <Layout.DrawerHeader
          title={t("volumes.edit_header")}
          buttons={[
            {
              onClick: handleDelete,
              icon: "delete32",
              label: t("actions.delete"),
              entity: volume,
              ability: "delete",
              className: "utility-button__icon--notice"
            }
          ]}
        />
        <Volume.Form fetcher={fetcher} model={volume} />
      </section>
    </>
  );
}
