import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function GroupSummarySection({ label, columns = 1, children }) {
  return (
    <div>
      <Styled.SectionLabel>{label}</Styled.SectionLabel>
      <Styled.SectionList $columns={columns}>{children}</Styled.SectionList>
    </div>
  );
}

GroupSummarySection.displayName = "ReadingGroup.GroupSummaryBox.Section";

GroupSummarySection.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOf([1, 2])
};

export default GroupSummarySection;
