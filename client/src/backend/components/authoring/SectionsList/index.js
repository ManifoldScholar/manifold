import React from "react";
import PropTypes from "prop-types";
import EntitiesList from "backend/components/list/EntitiesList";
import Section from "./SectionListItem";
import { sectionsAPI } from "api";
import { useApiCallback } from "hooks";

export default function SectionsList({
  sections = [],
  textId,
  startSectionId,
  refresh
}) {
  const updateSection = useApiCallback(sectionsAPI.update);

  const onReorder = async ({ id, position }) => {
    await updateSection(id, { attributes: { position } });
    refresh();
  };

  return sections.length ? (
    <div className="full-width">
      <EntitiesList
        entities={sections}
        entityComponent={Section}
        entityComponentProps={{ startSectionId, textId, refresh }}
        listStyle="bare"
        callbacks={{ onReorder }}
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
