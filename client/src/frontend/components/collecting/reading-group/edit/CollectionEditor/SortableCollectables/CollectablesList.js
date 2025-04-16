import React from "react";
import PropTypes from "prop-types";
import Collectable from "./Collectable";

const CollectablesList = React.memo(function CollectablesList({
  type,
  collectedIds,
  categoryId,
  ...collectableProps
}) {
  const hasCollectables = collectedIds.length > 0;

  if (!hasCollectables)
    return (
      <li key="empty">
        <Collectable type={type} index={0} id="empty" categoryId={categoryId} />
      </li>
    );

  return collectedIds.map((id, index) => (
    <li key={id}>
      <Collectable
        id={id}
        index={index}
        type={type}
        categoryId={categoryId}
        collectableCount={collectedIds.length}
        {...collectableProps}
      />
    </li>
  ));
});

CollectablesList.displayName =
  "ReadingGroup.Collecting.CollectionEditor.CollectablesList";

CollectablesList.propTypes = {
  type: PropTypes.string.isRequired,
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired
};

export default CollectablesList;
