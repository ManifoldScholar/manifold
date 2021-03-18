import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape, blockClassName } from "./helpers";

function CollectedResourceCollections({ showDropzone, ...restProps }) {
  return (
    <section className={blockClassName(showDropzone)}>
      <TypeHeader heading={"Resource Collections:"} />
      <SortableCollectables type="resourceCollections" {...restProps} />
    </section>
  );
}

CollectedResourceCollections.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.ResourceCollections";

CollectedResourceCollections.propTypes = collectedShape;

export default CollectedResourceCollections;
