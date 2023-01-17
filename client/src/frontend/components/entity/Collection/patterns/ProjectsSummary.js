import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import FooterLink from "../parts/FooterLink";
import EntityCollection from "../EntityCollection";

function ProjectsSummaryEntityCollection({ projects, ...passThroughProps }) {
  const { t } = useTranslation();

  return (
    <EntityCollection
      title={t("pages.projects_all")}
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
          label={t("navigation.see_all_projects")}
        />
      )}
      {...passThroughProps}
    />
  );
}

ProjectsSummaryEntityCollection.displayName =
  "Frontend.Entity.Collection.ProjectsSummary";

ProjectsSummaryEntityCollection.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ProjectsSummaryEntityCollection;
