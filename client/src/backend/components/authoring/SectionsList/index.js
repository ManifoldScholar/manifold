import React, { useState } from "react";
import PropTypes from "prop-types";
import EntitiesList from "backend/components/list/EntitiesList";
import Section from "./SectionListItem";
import { sectionsAPI } from "api";
import { useApiCallback, useFocusAfterRemoval } from "hooks";
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

  const { listRef, rememberRemoval } = useFocusAfterRemoval(sections);

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

  /* The wrapper renders even with no sections so it can hold focus after the
     last one is deleted — EntitiesList itself unmounts in that case. */
  return (
    <Styled.Wrapper
      className="full-width"
      ref={listRef}
      tabIndex={-1}
      aria-label={t("glossary.section_title_case_other")}
    >
      {sections.length > 0 && (
        <EntitiesList
          entities={sections}
          entityComponent={Section}
          entityComponentProps={{
            startSectionId,
            textId,
            refresh,
            setError,
            sectionCount: sections.length,
            onReorder,
            onBeforeDestroy: rememberRemoval
          }}
          listStyle="bare"
          callbacks={{ onReorder }}
          error={errorMessage}
        />
      )}
      {renderLiveRegion("alert")}
    </Styled.Wrapper>
  );
}

SectionsList.displayName = "Text.Sections.List";

SectionsList.propTypes = {
  textId: PropTypes.string.isRequired,
  sections: PropTypes.array,
  startTextSectionId: PropTypes.string,
  refresh: PropTypes.func
};

export default withScreenReaderStatus(SectionsList, false);
