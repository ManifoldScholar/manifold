import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import { getCollectableIcon } from "./helpers";
import * as Styled from "./styles";

function Empty({ type, wrapperRef, dragState }) {
  const { t } = useTranslation();

  return (
    <Styled.WrapperEmpty
      ref={wrapperRef}
      $hidden={dragState?.status === "is-over"}
    >
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
  type: PropTypes.string.isRequired,
};

export default Empty;
