import React from "react";
import PropTypes from "prop-types";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityMasthead from "frontend/components/composed/EntityMasthead";
import Journal from "frontend/components/journal";
import { useSelectVolume, useDispatchVolume } from "hooks/journals";

function VolumeDetailContainer({ match, journal }) {
  const { volume, volumeResponse } = useSelectVolume(match, journal);
  useDispatchVolume(match);

  if (!volumeResponse || !journal) return null;

  const {
    attributes: { title }
  } = volume;

  return (
    <>
      <CheckFrontendMode debugLabel="VolumeDetail" isProjectSubpage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendJournalsList"),
            label: "Back to All Journals"
          },
          {
            to: lh.link("frontendJournalDetail", journal.id),
            label: journal.attributes.titlePlaintext
          },
          {
            to: lh.link(
              "frontendVolumeDetail",
              journal.id,
              match.params.volumeSlug
            ),
            label: title
          }
        ]}
      />
      <EntityHeadContent entity={volume} parentEntity={journal} />
      <h1 className="screen-reader-text">{`${journal.attributes.title}: ${title}`}</h1>
      <EntityMasthead entity={journal} />
      <Journal.VolumeDetail journal={journal} volume={volume} />
    </>
  );
}

VolumeDetailContainer.displayName = "Frontend.Containers.VolumeDetail";

VolumeDetailContainer.propTypes = {
  match: PropTypes.object.isRequired,
  journal: PropTypes.object
};

export default VolumeDetailContainer;
