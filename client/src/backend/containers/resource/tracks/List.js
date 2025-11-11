import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import textTracksAPI from "api/resources/textTracks";
import EntitiesList, {
  Button,
  TextTrackRow
} from "backend/components/list/EntitiesList";
import { useFetch, useApiCallback } from "hooks";
import PageHeader from "backend/components/layout/PageHeader";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import withConfirmation from "hoc/withConfirmation";

function TextTracksListContainer({ confirm }) {
  const { t } = useTranslation();
  const { resource } = useOutletContext();

  const { data: tracks, refresh } = useFetch({
    request: [textTracksAPI.index, resource.id]
  });

  const destroyTrack = useApiCallback(id => {
    return textTracksAPI.destroy(resource.id, id);
  });

  const onDelete = async id => {
    const heading = t("modals.delete_track");
    const message = t("modals.confirm_body");
    if (confirm) {
      confirm(heading, message, async () => {
        await destroyTrack(id);
        refresh();
      });
    }
  };

  const closeUrl = lh.link("backendResourceTracks", resource.id);

  const drawerProps = {
    lockScroll: "always",
    closeUrl
  };

  const context = { resource, refresh };

  return (
    <>
      <OutletWithDrawer drawerProps={drawerProps} context={context} />
      <PageHeader type="list" title={t("titles.tracks")} hideBreadcrumbs />
      {!!tracks && (
        <EntitiesList
          entityComponent={TextTrackRow}
          entityComponentProps={{ onDelete, resourceId: resource.id }}
          entities={tracks}
          instructions={t("records.tracks.instructions")}
          buttons={[
            <Button
              path={lh.link("backendResourceTrackNew", resource.id)}
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

TextTracksListContainer.displayName = "Resource.Tracks";
TextTracksListContainer.propTypes = {
  confirm: PropTypes.func
};

export default withConfirmation(TextTracksListContainer);
