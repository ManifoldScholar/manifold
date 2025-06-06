import React from "react";
import PropTypes from "prop-types";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources,
  CollectedJournalIssues
} from "frontend/components/collecting/collection-blocks";
import { MD_TITLE_REGEX } from "../../edit/CollectionEditor/helpers/constants";
import * as Styled from "./styles";

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
      onUncollect,
      nested: true
    };
  }

  const {
    attributes: { title, descriptionFormatted, markdownOnly }
  } = category;

  const CategoryComponent = markdownOnly ? Styled.Markdown : Styled.Category;

  return (
    <CategoryComponent>
      <Styled.Header>
        {!MD_TITLE_REGEX.test(title) && <Styled.Title>{title}</Styled.Title>}
        {descriptionFormatted && (
          <Styled.Description
            dangerouslySetInnerHTML={{ __html: descriptionFormatted }}
          />
        )}
      </Styled.Header>
      <div>
        <CollectedProjects {...getCollectedProps("projects")} />
        <CollectedJournalIssues {...getCollectedProps("journalIssues")} />
        <CollectedTexts {...getCollectedProps("texts")} />
        <CollectedTextSections {...getCollectedProps("textSections")} />
        <CollectedResourceCollections
          {...getCollectedProps("resourceCollections")}
        />
        <CollectedResources {...getCollectedProps("resources")} />
      </div>
    </CategoryComponent>
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
