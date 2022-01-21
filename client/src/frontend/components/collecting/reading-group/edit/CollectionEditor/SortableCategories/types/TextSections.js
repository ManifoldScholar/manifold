import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedTextSections({ showDropzone, ...restProps }) {
  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={"Text Sections:"} />
      <SortableCollectables type="textSections" {...restProps} />
    </Styled.Type>
  );
}

CollectedTextSections.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.TextSections";

CollectedTextSections.propTypes = collectedShape;

export default CollectedTextSections;
