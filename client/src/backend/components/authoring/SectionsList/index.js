import React from "react";
import PropTypes from "prop-types";
import EntitiesList from "backend/components/list/EntitiesList";
import Section from "./SectionListItem";

export default function SectionsList({
  sections = [],
  textId,
  startSectionId
}) {
  return sections.length ? (
    <div className="full-width">
      <EntitiesList
        entities={sections}
        entityComponent={Section}
        entityComponentProps={{ startSectionId, textId }}
        listStyle="bare"
        callbacks={{}}
      />
    </div>
  ) : null;
}

SectionsList.displayName = "Text.Sections.List";

SectionsList.propTypes = {
  textId: PropTypes.string.isRequired,
  sections: PropTypes.array,
  startTextSectionId: PropTypes.string
};
