import PropTypes from "prop-types";
import Section from "./Section";

export default function SectionList({ sections, setSectionOrder, onDelete }) {
  return (
    <ul>
      {sections.map((section, i) => (
        <Section
          key={section.id}
          section={section}
          index={i}
          onDelete={onDelete}
          setSectionOrder={setSectionOrder}
          sectionCount={sections.length}
        />
      ))}
    </ul>
  );
}

SectionList.displayName = "CreateTextForm.Sections.List";

SectionList.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.exact({ id: PropTypes.string, name: PropTypes.string })
  ),
  setSectionOrder: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
