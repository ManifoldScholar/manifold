import React, { useState } from "react";
import PropTypes from "prop-types";
import EntitiesList from "backend/components/list/EntitiesList";
import Section from "./SectionListItem";
import { sectionsAPI } from "api";
import { useApiCallback } from "hooks";
import { useTranslation } from "react-i18next";

export default function SectionsList({
  sections = [],
  textId,
  startSectionId,
  refresh
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

  const onReorder = async ({ id, position }) => {
    setError(null);
    const res = await updateSection(id, { attributes: { position } });
    if (res?.errors) setError("reorder");
    refresh();
  };

  return sections.length ? (
    <div className="full-width">
      <EntitiesList
        entities={sections}
        entityComponent={Section}
        entityComponentProps={{ startSectionId, textId, refresh, setError }}
        listStyle="bare"
        callbacks={{ onReorder }}
        error={errorMessage}
      />
    </div>
  ) : null;
}

SectionsList.displayName = "Text.Sections.List";

SectionsList.propTypes = {
  textId: PropTypes.string.isRequired,
  sections: PropTypes.array,
  startTextSectionId: PropTypes.string,
  refresh: PropTypes.func
};
