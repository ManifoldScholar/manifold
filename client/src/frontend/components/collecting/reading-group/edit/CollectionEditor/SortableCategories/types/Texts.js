import React from "react";
import { useTranslation } from "react-i18next";
import { TypeHeader } from "../parts";
import SortableCollectables from "../../SortableCollectables";
import { collectedShape } from "./helpers";
import * as Styled from "./styles";

function CollectedTexts({ showDropzone, ...restProps }) {
  const { t } = useTranslation();

  return (
    <Styled.Type $active={showDropzone}>
      <TypeHeader heading={`${t("glossary.text_title_case_other")}:`} />
      <SortableCollectables type="texts" {...restProps} />
    </Styled.Type>
  );
}

CollectedTexts.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Texts";

CollectedTexts.propTypes = collectedShape;

export default CollectedTexts;
