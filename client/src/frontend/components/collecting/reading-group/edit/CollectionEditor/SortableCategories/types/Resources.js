import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape, blockClassName } from "./helpers";

function CollectedResources({ showDropzone, ...restProps }) {
  return (
    <section className={blockClassName(showDropzone)}>
      <TypeHeader heading={"Resources:"} />
      <SortableCollectables type="resources" {...restProps} />
    </section>
  );
}

CollectedResources.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Resources";

CollectedResources.propTypes = collectedShape;

export default CollectedResources;
