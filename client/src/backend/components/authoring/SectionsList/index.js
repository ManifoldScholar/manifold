import React, { useState } from "react";
import PropTypes from "prop-types";
import EntitiesList from "backend/components/list/EntitiesList";
import Section from "./SectionListItem";
import { sectionsAPI } from "api";
import { useApiCallback } from "hooks";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";

function SectionsList({
  sections = [],
  textId,
  startSectionId,
  refresh,
  renderLiveRegion,
  setScreenReaderStatus
}) {
  const { t } = useTranslation();
  const updateSection = useApiCallback(sectionsAPI.update);
  const [error, setError] = useState(null);

  /* eslint-disable no-nested-ternary */
  const errorMessage =
    error === "reorder"
      ? t("errors.section_reorder")
      : Array.isArray(error)
      ? error.map(e => e.detail).join(". ")
      : error;
  /* eslint-disable no-nested-ternary */

  const onReorder = async ({ id, title, position, ...rest }) => {
    setError(null);
    const res = await updateSection(id, { attributes: { position } });
    if (res?.errors) setError("reorder");

    const announcement = t("actions.dnd.moved_to_position", {
      title,
      position
    });
    const callback = () => {
      setScreenReaderStatus(announcement);

      if (rest.callback && typeof rest.callback === "function") {
        rest.callback();
      }
    };

    refresh(callback);
  };

  return sections.length ? (
    <Styled.Wrapper className="full-width">
      <EntitiesList
        entities={sections}
        entityComponent={Section}
        entityComponentProps={{
          startSectionId,
          textId,
          refresh,
          setError,
          sectionCount: sections.length,
          onReorder
        }}
        listStyle="bare"
        callbacks={{ onReorder }}
        error={errorMessage}
      />
      {renderLiveRegion("alert")}
    </Styled.Wrapper>
  ) : null;
}

SectionsList.displayName = "Text.Sections.List";

SectionsList.propTypes = {
  textId: PropTypes.string.isRequired,
  sections: PropTypes.array,
  startTextSectionId: PropTypes.string,
  refresh: PropTypes.func
};

export default withScreenReaderStatus(SectionsList, false);
