import React from "react";
import TypeHeader from "../parts/TypeHeader";
import { useTranslation } from "react-i18next";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import useDragMonitor from "./useDragMonitor";
import * as Styled from "./styles";

function CollectedProjects(props) {
  const { t } = useTranslation();

  const { hidden, active } = useDragMonitor("projects");

  return (
    <Styled.Type $active={active} $hidden={hidden}>
      <TypeHeader heading={`${t("glossary.project_title_case_other")}:`} />
      <SortableCollectables type="projects" {...props} />
    </Styled.Type>
  );
}

CollectedProjects.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Projects";

CollectedProjects.propTypes = collectedShape;

export default CollectedProjects;
