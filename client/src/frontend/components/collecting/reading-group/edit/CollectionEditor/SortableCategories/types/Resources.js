import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedResources({ showDropzone, ...restProps }) {
  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={"Resources:"} />
      <SortableCollectables type="resources" {...restProps} />
    </Styled.Type>
  );
}

CollectedResources.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Resources";

CollectedResources.propTypes = collectedShape;

export default CollectedResources;
