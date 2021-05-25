import React from "react";
import PropTypes from "prop-types";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources
} from "./collection-blocks";

function Category({ category, mappings, responses, onUncollect }) {
  const categoryMapping = mappings[category.id] || null;

  function getCollectedIdsByType(type) {
    if (!categoryMapping || !categoryMapping[type]) return [];
    return categoryMapping[type];
  }

  function getResponsesByType(type) {
    if (!responses || !responses[type]) return [];
    return responses[type];
  }

  function getCollectedProps(type) {
    return {
      collectedIds: getCollectedIdsByType(type),
      responses: getResponsesByType(type),
      onUncollect
    };
  }

  const {
    attributes: { title, descriptionFormatted }
  } = category;

  return (
    <article className="container group-collection-category">
      <header className="group-collection-category__header">
        <h2 className="group-collection-category__heading">{title}</h2>
        {descriptionFormatted && (
          <div
            dangerouslySetInnerHTML={{ __html: descriptionFormatted }}
            className="group-collection-category__description"
          />
        )}
      </header>
      <div className="group-collection-category__body">
        <CollectedProjects {...getCollectedProps("projects")} />
        <CollectedTexts {...getCollectedProps("texts")} />
        <CollectedTextSections {...getCollectedProps("textSections")} />
        <CollectedResourceCollections
          {...getCollectedProps("resourceCollections")}
        />
        <CollectedResources {...getCollectedProps("resources")} />
      </div>
    </article>
  );
}

Category.displayName = "ReadingGroup.Collecting.Category";

Category.propTypes = {
  category: PropTypes.object.isRequired,
  mappings: PropTypes.object,
  responses: PropTypes.object.isRequired,
  onUncollect: PropTypes.func
};

export default Category;
