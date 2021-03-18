import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape, blockClassName } from "./helpers";

function CollectedTextSections({ showDropzone, ...restProps }) {
  return (
    <section className={blockClassName(showDropzone)}>
      <TypeHeader heading={"Text Sections:"} />
      <SortableCollectables type="textSections" {...restProps} />
    </section>
  );
}

CollectedTextSections.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.TextSections";

CollectedTextSections.propTypes = collectedShape;

export default CollectedTextSections;
