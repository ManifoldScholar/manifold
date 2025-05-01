import React from "react";
import PropTypes from "prop-types";
import CollectablesList from "./CollectablesList";
import { collectedShape } from "../SortableCategories/types/helpers";
import * as Styled from "./styles";

function SortableCollectables({ type, ...restProps }) {
  return (
    <Styled.List>
      <CollectablesList type={type} {...restProps} />
    </Styled.List>
  );
}

SortableCollectables.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCollectables";

SortableCollectables.propTypes = {
  ...collectedShape,
  type: PropTypes.string.isRequired,
};

export default SortableCollectables;
