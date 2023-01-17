import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { useTranslation, Trans } from "react-i18next";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources,
  CollectedJournalIssues
} from "frontend/components/collecting/collection-blocks";
import { collectedIdsForCollection } from "frontend/components/collecting/helpers";
import EntityCollection from "../EntityCollection";

function MyStarredEntityCollection({
  collection,
  responses,
  onUncollect,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  const mapping = collection.attributes?.categoryMappings.$uncategorized$;
  const hasCollecteds = !isEmpty(mapping);
  const collectedIds = collectedIdsForCollection(collection);
  const totalCount = collectedIds.length;

  function getCollectedIdsByType(type) {
    if (!mapping || !mapping[type]) return [];
    return mapping[type];
  }

  function getResponsesByType(type) {
    if (!responses || !responses[type]) return [];
    return responses[type] || [];
  }

  function getCollectedProps(type) {
    return {
      collectedIds: getCollectedIdsByType(type),
      responses: getResponsesByType(type),
      onUncollect: () => onUncollect(type),
      boxed: true
    };
  }

  return (
    <EntityCollection
      title={t("pages.my_starred")}
      icon={"StarFillUnique"}
      iconProps={{ size: 48, className: "icon-star-fill--header" }}
      countProps={{
        count: totalCount,
        unit: t("glossary.item", { count: totalCount }),
        customTemplate: (count, unit) => (
          <span>
            <Trans
              i18nKey="counts.my_starred"
              values={{ count, unit }}
              components={[<strong />]}
            />
          </span>
        )
      }}
      BodyComponent={() =>
        hasCollecteds ? (
          <>
            <CollectedProjects {...getCollectedProps("projects")} />
            <CollectedJournalIssues {...getCollectedProps("journalIssues")} />
            <CollectedTexts {...getCollectedProps("texts")} />
            <CollectedTextSections {...getCollectedProps("textSections")} />
            <CollectedResourceCollections
              {...getCollectedProps("resourceCollections")}
            />
            <CollectedResources {...getCollectedProps("resources")} />
          </>
        ) : (
          <EntityCollectionPlaceholder.MyStarred />
        )
      }
      {...passThroughProps}
    />
  );
}

MyStarredEntityCollection.displayName = "Frontend.Entity.Collection.MyStarred";

MyStarredEntityCollection.propTypes = {
  collection: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  onUncollect: PropTypes.func.isRequired
};

export default MyStarredEntityCollection;
