import React from "react";
import PropTypes from "prop-types";
import EntityGroup from "global/components/composed/EntityGroup";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

function JournalVolumeList({ volumes, journal }) {
  if (!volumes || !journal) return null;

  return (
    <Styled.Wrapper>
      {volumes.map(volume => (
        <EntityGroup
          key={volume.id}
          title={`Volume ${volume.attributes.number}`}
          to={lh.link("frontendVolumeDetail", journal.id, volume.id)}
          entities={volume.relationships.journalIssues}
          parentView
        />
      ))}
    </Styled.Wrapper>
  );
}

JournalVolumeList.displayName = "Journal.VolumeList";

JournalVolumeList.propTypes = {
  journal: PropTypes.object,
  volumes: PropTypes.array
};

export default JournalVolumeList;
