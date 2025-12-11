import { useState } from "react";
import { useRevalidator } from "react-router";
import PropTypes from "prop-types";
import EntitiesList from "components/backend/list/EntitiesList";
import Section from "./SectionListItem";
import { sectionsAPI } from "api";
import { useApiCallback } from "hooks";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";
import withScreenReaderStatus from "components/hoc/withScreenReaderStatus";

function SectionsList({
  sections = [],
  textId,
  startSectionId,
  confirm,
  renderLiveRegion,
  setScreenReaderStatus
}) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
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
    if (res?.errors) {
      setError("reorder");
      revalidate();
    } else {
      const announcement = t("actions.dnd.moved_to_position", {
        title,
        position
      });
      setScreenReaderStatus(announcement);
    }

    if (rest.callback && typeof rest.callback === "function") {
      rest.callback();
    }
  };

  return sections.length ? (
    <Styled.Wrapper className="full-width">
      <EntitiesList
        entities={sections}
        entityComponent={Section}
        entityComponentProps={{
          startSectionId,
          textId,
          confirm,
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
  startSectionId: PropTypes.string,
  revalidate: PropTypes.func,
  confirm: PropTypes.func
};

export default withScreenReaderStatus(SectionsList, false);
