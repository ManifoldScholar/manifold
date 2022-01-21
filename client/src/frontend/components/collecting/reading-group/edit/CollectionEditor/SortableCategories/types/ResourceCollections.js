import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedResourceCollections({ showDropzone, ...restProps }) {
  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={"Resource Collections:"} />
      <SortableCollectables type="resourceCollections" {...restProps} />
    </Styled.Type>
  );
}

CollectedResourceCollections.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.ResourceCollections";

CollectedResourceCollections.propTypes = collectedShape;

export default CollectedResourceCollections;
