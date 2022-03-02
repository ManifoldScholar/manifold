import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ResourceList from "frontend/components/resource-list";
import { ListFilters } from "global/components/list";
import Utility from "frontend/components/utility";
import lh from "helpers/linkHandler";
import Title from "../Title";
import { useListFilters } from "hooks";
import * as Styled from "./styles";

export default function ResourceCollectionDetail(props) {
  const {
    resourceCollection,
    project,
    resourceCollectionUrl,
    slideshowResources,
    slideshowPagination,
    collectionResources,
    resourceCollectionPagination,
    resourceCollectionPaginationHandler,
    dispatch,
    filterChange,
    initialFilterState
  } = props;

  const { t } = useTranslation();

  const filterProps = useListFilters({
    onFilterChange: filterChange,
    initialState: initialFilterState,
    resetState: initialFilterState,
    options: {
      sort: true,
      kinds: resourceCollection.attributes.resourceKinds,
      tags: resourceCollection.attributes.resourceTag
    }
  });

  const renderDescription = description => {
    if (!description) return null;
    return (
      <div
        className="collection-detail__description"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  };

  if (!project || !resourceCollection) return null;

  const attr = resourceCollection.attributes;
  const count = attr.collectionResourcesCount;

  return (
    <section className="collection-detail">
      <div className="collection-detail__container container flush-bottom">
        <Title resourceCollection={resourceCollection} showCreatedAt />
        {renderDescription(attr.descriptionFormatted)}
        <div className="collection-detail__utility">
          <Utility.ShareBar url={resourceCollectionUrl} />
        </div>
      </div>
      <h2 className="screen-reader-text">
        {t("pages.subheaders.resource_slideshow")}
      </h2>
      <ResourceList.Slideshow
        resourceCollection={resourceCollection}
        collectionResources={slideshowResources}
        count={project.attributes.resourcesCount}
        pagination={slideshowPagination}
        dispatch={dispatch}
      />
      <div className="container flush-top collection-detail__resources">
        <h2 className="screen-reader-text">
          {t("pages.subheaders.resource_list")}
        </h2>
        <Styled.EntityListTotal
          linkTo={lh.link("frontendProjectResources", project.attributes.slug)}
          entityName={t("glossary.resource", { count })}
          count={count}
        />
        <ListFilters {...filterProps} />
        <ResourceList.Cards
          resourceCollection={resourceCollection}
          project={project}
          resources={collectionResources}
          pagination={resourceCollectionPagination}
          paginationClickHandler={resourceCollectionPaginationHandler}
          itemHeadingLevel={3}
        />
      </div>
    </section>
  );
}

ResourceCollectionDetail.displayName = "ResourceCollection.Detail";

ResourceCollectionDetail.propTypes = {
  resourceCollection: PropTypes.object,
  project: PropTypes.object,
  resourceCollectionUrl: PropTypes.string.isRequired,
  slideshowResources: PropTypes.array,
  slideshowPagination: PropTypes.object,
  collectionResources: PropTypes.array,
  resourceCollectionPagination: PropTypes.object,
  resourceCollectionPaginationHandler: PropTypes.func,
  dispatch: PropTypes.func,
  filterChange: PropTypes.func.isRequired,
  initialFilterState: PropTypes.object
};
