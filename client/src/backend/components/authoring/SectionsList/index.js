import React from "react";
import PropTypes from "prop-types";
import EntitiesList from "backend/components/list/EntitiesList";
import Section from "./SectionListItem";

export default function SectionsList({
  sections = [],
  textId,
  onDelete,
  onReorder = () => {}
}) {
  return sections.length ? (
    <div className="full-width">
      <EntitiesList
        entities={sections}
        entityComponent={Section}
        entityComponentProps={{ onDelete, textId }}
        listStyle="bare"
        callbacks={{ onReorder }}
      />
    </div>
  ) : null;
}

SectionsList.displayName = "Text.Sections.List";

SectionsList.propTypes = {
  sections: PropTypes.array,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onReorder: PropTypes.func
};
