import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import textTracksAPI from "api/resources/textTracks";
import EntitiesList, {
  Button,
  TextTrackRow
} from "backend/components/list/EntitiesList";
import { useFetch, useApiCallback } from "hooks";
import PageHeader from "backend/components/layout/PageHeader";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import withConfirmation from "hoc/withConfirmation";

function TextTracksListContainer({ resource, route, confirm }) {
  const { t } = useTranslation();

  const { data: tracks, meta, refresh } = useFetch({
    request: [textTracksAPI.index, resource.id]
  });

  const destroyTrack = useApiCallback(id => {
    return textTracksAPI.destroy(resource.id, id);
  });

  const onDelete = id => {
    const heading = t("modals.delete_track");
    const message = t("modals.confirm_body");
    if (confirm) {
      confirm(heading, message, async () => {
        await destroyTrack(id);
        refresh();
      });
    }
  };

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendResourceTracks", resource.id);

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        closeUrl
      },
      childProps: { resource, refresh }
    });
  };

  return (
    <>
      {renderChildRoutes()}
      <PageHeader type="list" title={t("titles.tracks")} />
      {!!tracks && (
        <EntitiesList
          entityComponent={TextTrackRow}
          entityComponentProps={{ onDelete, resourceId: resource.id }}
          entities={tracks}
          rowClickMode="block"
          unit={t("glossary.track", {
            count: meta?.pagination?.totalCount
          })}
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
  resource: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  confirm: PropTypes.func
};

export default withConfirmation(TextTracksListContainer);
