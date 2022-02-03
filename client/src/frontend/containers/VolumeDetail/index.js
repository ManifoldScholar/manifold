import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import lh from "helpers/linkHandler";
import { journalVolumesAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityMasthead from "frontend/components/composed/EntityMasthead";
import Journal from "frontend/components/journal";
import { useFetch } from "hooks";

function VolumeDetailContainer({ journal }) {
  const { volumeSlug: slug } = useParams();
  const { data: volume } = useFetch({
    request: [journalVolumesAPI.show, slug]
  });

  return journal && volume ? (
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
            to: lh.link("frontendVolumeDetail", journal.id, slug),
            label: `Volume ${volume.attributes.number}`
          }
        ]}
      />
      <EntityHeadContent entity={volume} type="Volume" parentEntity={journal} />
      <h1 className="screen-reader-text">{`${journal.attributes.title}: Volume ${volume.attributes.number}`}</h1>
      <EntityMasthead entity={journal} />
      <Journal.VolumeDetail journal={journal} volume={volume} />
    </>
  ) : null;
}

VolumeDetailContainer.displayName = "Frontend.Containers.VolumeDetail";

VolumeDetailContainer.propTypes = {
  journal: PropTypes.object
};

export default VolumeDetailContainer;
