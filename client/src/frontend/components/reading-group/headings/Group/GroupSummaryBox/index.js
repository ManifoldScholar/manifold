import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { useTranslation } from "react-i18next";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import Section from "./Section";
import Item from "./Item";
import * as Styled from "./styles";

function getUniqueTypes(mappings) {
  const allTypes = mappings.flatMap(category => Object.keys(category));
  return [...new Set(allTypes)];
}

function aggregateMappingsByType(type, mappingValues) {
  // get arrays of collected IDs by type from each category
  const valuesByType = mappingValues.map(category => category[type] || []);
  // reduce to a single array
  return valuesByType.reduce(
    (previous, current) => previous.concat(current),
    []
  );
}

function collectedIdsForCollectionByType(readingGroup) {
  const collection = getEntityCollection(readingGroup);

  if (!collection?.attributes) return {};

  // get an array of objects containing collected IDs by type
  const mappingValues = Object.values(collection.attributes.categoryMappings);

  // if nothing's been collected, just return an empty object
  if (!mappingValues.length) return {};

  // get an array of unique types for all collected items
  const uniqueTypes = getUniqueTypes(mappingValues);

  // return an object with counts by type
  return Object.assign(
    {},
    ...uniqueTypes.map(type => ({
      [type]: aggregateMappingsByType(type, mappingValues)
    }))
  );
}

function GroupSummaryBox({ readingGroup, isBackend }) {
  const uid = useUID();
  const { t } = useTranslation();
  const {
    privacy,
    annotationsCount,
    membershipsCount,
    currentUserRole,
    currentUserCounts,
    creatorName
  } = readingGroup.attributes;
  const collected = collectedIdsForCollectionByType(readingGroup);

  function getCollectedCount(type) {
    return collected[type]?.length || 0;
  }

  return (
    <Styled.Summary>
      <h2 id={uid} className="screen-reader-text">
        {t("pages.subheaders.group_summary")}
      </h2>
      <Styled.List aria-labelledby={uid}>
        <Section label={t("common.about")} columns={isBackend ? 2 : 1}>
          <Item labelText={t("common.type")}>
            {privacy}
            {privacy === "private" && <Styled.Icon icon="lock16" size={16} />}
          </Item>
          {isBackend ? (
            <>
              <Item
                labelText={t("glossary.annotation_other")}
                icon="interactComment32"
              >
                {annotationsCount}
              </Item>
              <Item labelText={t("glossary.creator_one")} icon="avatar24" block>
                {creatorName}
              </Item>
            </>
          ) : (
            <Item labelText={t("common.role_one")} icon="avatar24">
              {currentUserRole}
            </Item>
          )}
          <Item labelText={t("glossary.member_other")} icon="readingGroup24">
            {membershipsCount}
          </Item>
        </Section>
        {!isBackend && (
          <Section label={t("glossary.annotation_other")}>
            <Item labelText={t("glossary.group_one")} icon="interactComment32">
              {annotationsCount}
            </Item>
            <Item labelText={t("common.yours")} icon="interactAnnotate32">
              {currentUserCounts.annotationsCount}
            </Item>
          </Section>
        )}
        <Section label={t("common.content")} columns={2}>
          <Item labelText={t("glossary.project_other")} icon="BELibrary64">
            {getCollectedCount("projects")}
          </Item>
          <Item
            labelText={t("glossary.collection_other")}
            icon="resourceCollection64"
          >
            {getCollectedCount("resourceCollections")}
          </Item>
          <Item labelText={t("glossary.text_other")} icon="textsLoosePages64">
            {getCollectedCount("texts")}
          </Item>
          <Item labelText={t("glossary.resource_other")} icon="resources64">
            {getCollectedCount("resources")}
          </Item>
          <Item labelText={t("glossary.text_section_other")} icon="toc64">
            {getCollectedCount("textSections")}
          </Item>
        </Section>
      </Styled.List>
    </Styled.Summary>
  );
}

GroupSummaryBox.displayName = "ReadingGroup.GroupSummaryBox";

GroupSummaryBox.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  isBackend: PropTypes.bool
};

export default GroupSummaryBox;
