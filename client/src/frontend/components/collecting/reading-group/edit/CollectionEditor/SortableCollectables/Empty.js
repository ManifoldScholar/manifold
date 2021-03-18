import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import { getCollectableIcon } from "../helpers/resolvers";

function Empty({ type }) {
  return (
    <div className="group-collection-editor__collectable-wrapper group-collection-editor__collectable-wrapper--empty">
      <div className="group-collection-editor__block group-collection-editor__block--empty">
        <IconComposer icon={getCollectableIcon(type)} size={32} />
        <span className="group-collection-editor__label group-collection-editor__label--collectable-type">
          Drag here to add
        </span>
      </div>
    </div>
  );
}

Empty.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCollectables.Empty";

Empty.propTypes = {
  type: PropTypes.string.isRequired
};

export default Empty;
