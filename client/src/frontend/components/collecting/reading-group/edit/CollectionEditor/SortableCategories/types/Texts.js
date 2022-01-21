import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedTexts({ showDropzone, ...restProps }) {
  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={"Texts:"} />
      <SortableCollectables type="texts" {...restProps} />
    </Styled.Type>
  );
}

CollectedTexts.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Texts";

CollectedTexts.propTypes = collectedShape;

export default CollectedTexts;
