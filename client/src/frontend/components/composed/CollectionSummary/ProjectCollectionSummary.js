import * as React from "react";
import PropTypes from "prop-types";
import CollectionSummary from ".";

const getHeroParams = collection => {
  if (!collection.heroStyles) return null;
  const layout = collection.heroLayout.split("_")[0];
  const url =
    layout === "square"
      ? collection.heroStyles.mediumSquare
      : collection.heroStyles.largeLandscape;
  return { url, layout };
};

export default function ProjectCollectionSummary(props) {
  const { projectCollection, limit, ordinal, invertColor } = props;
  const collection = projectCollection.attributes;
  const entities =
    projectCollection.projects.length > limit
      ? projectCollection.projects.slice(0, limit)
      : projectCollection.projects;
  const hero = getHeroParams(collection);
  const background = ordinal % 2 === (invertColor ? 1 : 0);
  return (
    <CollectionSummary
      collection={collection}
      entities={entities}
      hero={hero}
      background={background}
    />
  );
}

ProjectCollectionSummary.propTypes = {
  projectCollection: PropTypes.object.isRequired,
  limit: PropTypes.number,
  ordinal: PropTypes.number,
  invertColor: PropTypes.bool
};
