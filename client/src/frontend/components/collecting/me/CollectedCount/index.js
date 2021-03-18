import React from "react";
import PropTypes from "prop-types";
import { collectedIdsForCollection } from "frontend/components/collecting/helpers";

function CollectedCount({ collection }) {
  const collectedIds = collectedIdsForCollection(collection);
  const totalCount = collectedIds.length;
  const label = totalCount === 1 ? "item" : "items";

  if (!collection?.length < 1) return null;

  return (
    <p className="list-total">
      You have starred{" "}
      <span className="list-total__highlighted">{totalCount}</span> {label}
      {":"}
    </p>
  );
}

CollectedCount.displayName = "Collecting.CollectedCount";

CollectedCount.propTypes = {
  collection: PropTypes.object
};

export default CollectedCount;
