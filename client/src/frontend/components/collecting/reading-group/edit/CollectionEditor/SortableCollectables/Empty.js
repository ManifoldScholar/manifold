import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import { getCollectableIcon } from "../helpers/resolvers";
import * as Styled from "./styles";

function Empty({ type }) {
  const { t } = useTranslation();

  return (
    <Styled.WrapperEmpty>
      <Styled.CollectableEmpty>
        <IconComposer icon={getCollectableIcon(type)} size={32} />
        <Styled.Label>{t("forms.category.empty_placeholder")}</Styled.Label>
      </Styled.CollectableEmpty>
    </Styled.WrapperEmpty>
  );
}

Empty.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCollectables.Empty";

Empty.propTypes = {
  type: PropTypes.string.isRequired
};

export default Empty;
