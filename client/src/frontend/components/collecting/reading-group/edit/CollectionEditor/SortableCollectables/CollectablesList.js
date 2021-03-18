import React from "react";
import PropTypes from "prop-types";
import Collectable from "./Collectable";
import Empty from "./Empty";

const CollectablesList = React.memo(function CollectablesList({
  type,
  collectedIds,
  responses,
  onRemove
}) {
  const hasCollectables = collectedIds.length > 0;

  if (!hasCollectables)
    return (
      <li key="empty">
        <Empty type={type} />
      </li>
    );

  return collectedIds.map((id, index) => (
    <li key={id}>
      <Collectable
        id={id}
        index={index}
        type={type}
        responses={responses}
        onRemove={onRemove}
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
  onRemove: PropTypes.func.isRequired
};

export default CollectablesList;
