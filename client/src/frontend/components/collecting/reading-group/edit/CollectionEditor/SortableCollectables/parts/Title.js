import React from "react";
import PropTypes from "prop-types";
import Skeleton from "frontend/components/collecting/ContentSkeleton";
import { getResponse, idInResponses, getCollectableTitle } from "../../helpers/resolvers";

function CollectableTitle({ id, responses }) {
  const isLoaded = idInResponses(id, responses);

  if (!isLoaded) return <Skeleton />;

  const response = getResponse(id, responses);

  return (
    <h5
      dangerouslySetInnerHTML={{ __html: getCollectableTitle(response) }}
      className="collection-category-builder__collectable-title"
    />
  );
}

CollectableTitle.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Collectable.Title";

CollectableTitle.propTypes = {
  id: PropTypes.string.isRequired,
  responses: PropTypes.array.isRequired
};

export default CollectableTitle;
