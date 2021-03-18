import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape, blockClassName } from "./helpers";

function CollectedTexts({ showDropzone, ...restProps }) {
  return (
    <section className={blockClassName(showDropzone)}>
      <TypeHeader heading={"Texts:"} />
      <SortableCollectables type="texts" {...restProps} />
    </section>
  );
}

CollectedTexts.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Texts";

CollectedTexts.propTypes = collectedShape;

export default CollectedTexts;
