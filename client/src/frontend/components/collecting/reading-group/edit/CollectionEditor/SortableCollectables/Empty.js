import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import { getCollectableIcon } from "../helpers/resolvers";

function Empty({ type }) {
  return (
    <div className="collection-category-builder__block collection-category-builder__block--empty">
      <IconComposer icon={getCollectableIcon(type)} size={32} />
      <span className="collection-category-builder__label collection-category-builder__label--collectable-type">
        Drag here to add
      </span>
    </div>
  );
}

Empty.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCollectables.Empty";

Empty.propTypes = {
  type: PropTypes.string.isRequired
};

export default Empty;
