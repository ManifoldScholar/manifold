import React from "react";
import PropTypes from "prop-types";
import Block from "./Block";

const order = [
  "projects",
  "texts",
  "textSections",
  "resourceCollections",
  "resources"
];

function sort(items) {
  // eslint-disable-next-line func-names
  const sorted = items.sort(function(a, b) {
    return order.indexOf(a) - order.indexOf(b);
  });
  return sorted;
}

function getCollectables(collection) {
  return collection?.attributes.categoryMappings.$uncategorized$;
}

function CollectedBlocks({ collection }) {
  const collectables = getCollectables(collection);
  const types = Object.keys(collectables);
  const sortedTypes = sort(types);

  return sortedTypes.map(type => (
    <Block key={type} type={type} collectableIds={collectables[type]} />
  ));
}

CollectedBlocks.displayName = "Collecting.CollectedBlocks";

CollectedBlocks.propTypes = {
  collection: PropTypes.object.isRequired
};

export default CollectedBlocks;
