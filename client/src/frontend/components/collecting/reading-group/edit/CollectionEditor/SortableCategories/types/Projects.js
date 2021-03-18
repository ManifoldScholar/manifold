import React from "react";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape, blockClassName } from "./helpers";

function CollectedProjects({ showDropzone, ...restProps }) {
  return (
    <section className={blockClassName(showDropzone)}>
      <TypeHeader heading={"Projects:"} />
      <SortableCollectables type="projects" {...restProps} />
    </section>
  );
}

CollectedProjects.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Projects";

CollectedProjects.propTypes = collectedShape;

export default CollectedProjects;
