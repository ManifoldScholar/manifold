import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import FooterLink from "../parts/FooterLink";
import EntityCollection from "../EntityCollection";

function ProjectsSummaryEntityCollection({ projects, ...passThroughProps }) {
  return (
    <EntityCollection
      title="All Projects"
      icon="projects64"
      BodyComponent={props => (
        <ThumbnailGrid {...props}>
          {({ stack }) =>
            projects.map(item => (
              <EntityThumbnail key={item.id} entity={item} stack={stack} />
            ))
          }
        </ThumbnailGrid>
      )}
      FooterComponent={() => (
        <FooterLink
          to={lh.link("frontendProjectsAll")}
          label="See all projects"
        />
      )}
      {...passThroughProps}
    />
  );
}

ProjectsSummaryEntityCollection.displayName =
  "Global.Composed.EntityCollection.ProjectsSummary";

ProjectsSummaryEntityCollection.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ProjectsSummaryEntityCollection;
