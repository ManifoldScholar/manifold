import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import Utility from "global/components/utility";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import Section from "./Section";
import Item from "./Item";

function collectedIdsForCollectionByType(readingGroup) {
  const collection = getEntityCollection(readingGroup);
  if (!collection?.attributes) return [];
  const mappings = collection.attributes.categoryMappings;
  return Object.assign({}, ...Object.values(mappings));
}

function GroupSummaryBox({ readingGroup }) {
  const uid = useUID();
  const {
    privacy,
    highlightsCount,
    annotationsCount,
    membershipsCount,
    currentUserRole,
    currentUserAnnotationsCount = 12,
    currentUserHighlightsCount = 9
  } = readingGroup.attributes;
  const collected = collectedIdsForCollectionByType(readingGroup);

  function getCollectedCount(type) {
    return collected[type]?.length || 0;
  }

  return (
    <div className="group-summary">
      <h2 id={uid} className="screen-reader-text">
        Group Summary
      </h2>
      <dl aria-labelledby={uid} className="group-summary__list">
        <Section label="About">
          <Item labelText="Type">
            {privacy}
            {privacy === "private" && (
              <Utility.IconComposer
                icon="lock16"
                size={16}
                iconClass="group-summary__private-icon"
              />
            )}
          </Item>
          <Item labelText="Members" icon="readingGroup24">
            {membershipsCount}
          </Item>
          <Item labelText="Role" icon="avatar24">
            {currentUserRole}
          </Item>
        </Section>
        <Section label="Group">
          <Item labelText="Annotations" icon="interactAnnotate32">
            {annotationsCount}
          </Item>
          <Item labelText="Highlights" icon="interactHighlight32">
            {highlightsCount}
          </Item>
        </Section>
        <Section label="Yours">
          <Item labelText="Annotations" icon="interactAnnotate32">
            {currentUserAnnotationsCount}
          </Item>
          <Item labelText="Highlights" icon="interactHighlight32">
            {currentUserHighlightsCount}
          </Item>
        </Section>
        <Section label="Content" columns={2}>
          <Item labelText="Projects" icon="BELibrary64">
            {getCollectedCount("projects")}
          </Item>
          <Item labelText="Texts" icon="textsLoosePages64">
            {getCollectedCount("texts")}
          </Item>
          <Item labelText="Text Sections" icon="toc64">
            {getCollectedCount("textSections")}
          </Item>
          <Item labelText="Collections" icon="resourceCollection64">
            {getCollectedCount("resourceCollections")}
          </Item>
          <Item labelText="Resources" icon="resources64">
            {getCollectedCount("resources")}
          </Item>
        </Section>
      </dl>
    </div>
  );
}

GroupSummaryBox.displayName = "ReadingGroup.GroupSummaryBox";

GroupSummaryBox.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default GroupSummaryBox;
