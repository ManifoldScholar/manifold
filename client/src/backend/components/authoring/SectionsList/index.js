import React from "react";
import PropTypes from "prop-types";
import EntitiesList from "backend/components/list/EntitiesList";
import Section from "./SectionListItem";

export default function SectionsList({
  sections = [
    { attributes: { title: "A Section" } },
    { attributes: { title: "Another Section" } }
  ],
  onDelete,
  onEdit,
  onReorder = () => {}
}) {
  return (
    <div className="full-width">
      <EntitiesList
        entities={sections}
        entityComponent={Section}
        entityComponentProps={{ onDelete, onEdit }}
        listStyle="bare"
        callbacks={{ onReorder }}
      />
    </div>
  );
}

SectionsList.displayName = "Text.Sections.List";

SectionsList.propTypes = {
  sections: PropTypes.array,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onReorder: PropTypes.func
};
