import React from 'react'
import PropTypes from 'prop-types'
import IconComposer from "global/components/utility/IconComposer";

function Drag({ dragHandleProps }) {
  return (
    <div {...dragHandleProps} className="collection-category-builder__action">
      <IconComposer icon="grabber32" size="default" />
    </div>
  );
}

Drag.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Collectable.Drag";

Drag.propTypes = {
  dragHandleProps: PropTypes.object.isRequired,
};

export default Drag
