import React from "react";
import PropTypes from "prop-types";
import { ProjectCollectionIcon } from "../parts";
import EntityCollection from "../EntityCollection";
import Journal from "frontend/components/journal";

function JournalVolumesEntityCollection({
  journal,
  volumes,
  meta,
  paginationProps,
  ...passThroughProps
}) {
  if (!journal || !volumes) return null;

  const { title } = journal.attributes ?? {};

  return (
    <EntityCollection
      title={`${title}: Volumes`}
      IconComponent={props => (
        <ProjectCollectionIcon {...props} collection={journal} />
      )}
      headerLayout="title_only"
      BodyComponent={() => (
        <Journal.VolumeList
          journal={journal}
          volumes={volumes}
          pagination={paginationProps.pagination}
        />
      )}
      countProps={
        !meta
          ? {}
          : {
              pagination: meta.pagination,
              unit: "volume"
            }
      }
      paginationProps={
        !meta || !paginationProps
          ? {}
          : {
              pagination: meta.pagination,
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

JournalVolumesEntityCollection.displayName =
  "Frontend.Composed.EntityCollection.JournalVolumes";

JournalVolumesEntityCollection.propTypes = {
  journal: PropTypes.object.isRequired,
  volumes: PropTypes.array.isRequired
};

export default JournalVolumesEntityCollection;
