import React from "react";
import { TypeHeader } from "../parts";
import { useTranslation } from "react-i18next";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import { capitalize } from "utils/string";
import * as Styled from "./styles";

function CollectedProjects({ showDropzone, ...restProps }) {
  const { t } = useTranslation();

  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={`${capitalize(t("glossary.project_other"))}:`} />
      <SortableCollectables type="projects" {...restProps} />
    </Styled.Type>
  );
}

CollectedProjects.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Projects";

CollectedProjects.propTypes = collectedShape;

export default CollectedProjects;
