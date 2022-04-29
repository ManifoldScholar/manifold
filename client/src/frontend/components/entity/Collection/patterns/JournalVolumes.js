import React from "react";
import PropTypes from "prop-types";
import EntityCollection from "../EntityCollection";
import Journal from "frontend/components/journal";

function JournalVolumesEntityCollection({
  journal,
  volumes,
  meta,
  paginationProps,
  ...passThroughProps
}) {
  if (!journal || !volumes?.length) return null;

  return (
    <EntityCollection
      headerLayout="title_only"
      BodyComponent={() => (
        <Journal.VolumeList journal={journal} volumes={volumes} />
      )}
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
  "Frontend.Entity.Collection.JournalVolumes";

JournalVolumesEntityCollection.propTypes = {
  journal: PropTypes.object,
  volumes: PropTypes.array,
  meta: PropTypes.object,
  paginationProps: PropTypes.object,
  countProps: PropTypes.object,
  title: PropTypes.string,
  FooterComponent: PropTypes.func
};

export default JournalVolumesEntityCollection;
