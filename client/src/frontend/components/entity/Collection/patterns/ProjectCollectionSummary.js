import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import { FooterLink, ProjectCollectionIcon } from "../parts";
import EntityCollection from "../EntityCollection";
import { getHeroImage, getHeaderLayout } from "../helpers";

function ProjectCollectionSummaryEntityCollection({
  projectCollection,
  paginationProps,
  filterProps,
  limit,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  const {
    title,
    slug,
    descriptionFormatted: description,
    shortDescriptionFormatted: shortDescription
  } = projectCollection.attributes;

  const getProjects = () => {
    const adjustedLimit = limit && limit > 0 ? limit : 100;
    if (!Array.isArray(projectCollection.relationships.collectionProjects))
      return [];
    const projects = projectCollection.relationships.collectionProjects.map(
      cp => cp.relationships.project
    );
    return projects.slice(0, adjustedLimit);
  };

  const projects = getProjects();
  const headerLayout = getHeaderLayout(projectCollection);
  const image = getHeroImage(headerLayout, projectCollection);
  const imageAlt = projectCollection.attributes.heroAltText;
  const totalprojectCount =
    projectCollection.relationships.collectionProjects?.length;

  return (
    <EntityCollection
      title={title}
      description={shortDescription || description}
      IconComponent={ProjectCollectionIcon}
      iconProps={{ collection: projectCollection }}
      image={image}
      imageAlt={imageAlt}
      headerLayout={headerLayout}
      headerWidth="100%"
      headerLink={lh.link("frontendProjectCollection", slug)}
      BodyComponent={props =>
        !!projects?.length && (
          <ThumbnailGrid isList={projects.length > 1} {...props}>
            {({ stack }) =>
              projects.map(item => (
                <EntityThumbnail
                  key={item.id}
                  entity={item}
                  stack={stack}
                  isListItem={projects.length > 1}
                />
              ))
            }
          </ThumbnailGrid>
        )
      }
      FooterComponent={() =>
        totalprojectCount > limit && (
          <FooterLink
            to={lh.link("frontendProjectCollection", slug)}
            label={t("navigation.see_full_collection")}
          />
        )
      }
      {...passThroughProps}
    />
  );
}

ProjectCollectionSummaryEntityCollection.displayName =
  "Frontend.Entity.Collection.ProjectCollectionSummary";

ProjectCollectionSummaryEntityCollection.propTypes = {
  projectCollection: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object),
  projectsMeta: PropTypes.object,
  limit: PropTypes.number
};

export default ProjectCollectionSummaryEntityCollection;
