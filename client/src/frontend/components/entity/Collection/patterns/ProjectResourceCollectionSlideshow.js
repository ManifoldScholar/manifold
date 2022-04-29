import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import IconComposer from "global/components/utility/IconComposer";
import ResourceList from "frontend/components/resource-list";
import lh from "helpers/linkHandler";
import EntityCollection from "../EntityCollection";

function ProjectResourceCollectionSlideshow({
  resourceCollection,
  slideshowResources,
  slideshowResourcesMeta,
  resourceCollectionUrl,
  dispatch,
  handleClose,
  ...passThroughProps
}) {
  const handleEscape = useCallback(
    event => {
      if (event.key !== "Escape") return;
      handleClose(event);
    },
    [handleClose]
  );

  useEffect(() => {
    window.addEventListener("keyup", handleEscape);

    return () => window.removeEventListener("keyup", handleEscape);
  }, [handleEscape]);

  const { t } = useTranslation();

  const collectionUrl =
    resourceCollectionUrl ||
    lh.link(
      "frontendProjectResourceCollection",
      resourceCollection.relationships.project.attributes.slug,
      resourceCollection.attributes.slug
    );

  return (
    <EntityCollection
      nested
      title={resourceCollection.attributes.title}
      DescriptionComponent={props => (
        <FormattedDate
          prefix={t("dates.collection_created")}
          format="MMMM yyyy"
          date={resourceCollection.attributes.createdAt}
          {...props}
        />
      )}
      icon="resourceCollection64"
      headerLayout="title_image"
      headerWidth="100%"
      BodyComponent={props => (
        <div {...props}>
          <h2 className="screen-reader-text">
            {t("pages.subheaders.resource_slideshow")}
          </h2>
          <ResourceList.Slideshow
            resourceCollection={resourceCollection}
            collectionResources={slideshowResources}
            pagination={slideshowResourcesMeta?.pagination}
            dispatch={dispatch}
            slideOptions={{ enableZoom: false }}
          />
        </div>
      )}
      FooterComponent={props => (
        <nav className="button-nav button-nav--stack" {...props}>
          <Link
            to={collectionUrl}
            className="button-secondary button-secondary--outlined"
          >
            <span className="button-secondary__text">
              {t("navigation.visit_collection")}
            </span>
            <IconComposer
              icon="arrowRight16"
              size="default"
              className="button-secondary__icon"
            />
          </Link>
          <button
            onClick={handleClose}
            className="button-secondary button-secondary--outlined button-secondary--dull"
            data-id="close-overlay"
          >
            <IconComposer
              icon="arrowLeft16"
              size="default"
              className="button-secondary__icon"
            />
            <span className="button-secondary__text">
              {t("navigation.return_to_reader")}
            </span>
          </button>
        </nav>
      )}
      {...passThroughProps}
    />
  );
}

ProjectResourceCollectionSlideshow.displayName =
  "Frontend.Entity.Collection.ProjectResourceCollectionSlideshow";

ProjectResourceCollectionSlideshow.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  slideshowResources: PropTypes.array,
  slideshowResourcesMeta: PropTypes.object,
  dispatch: PropTypes.func,
  resourceCollectionUrl: PropTypes.string,
  handleClose: PropTypes.func
};

export default ProjectResourceCollectionSlideshow;
