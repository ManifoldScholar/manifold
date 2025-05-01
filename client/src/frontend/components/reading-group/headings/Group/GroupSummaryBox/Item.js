import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import * as Styled from "./styles";

function GroupSummaryItem({ labelText, icon, children, block }) {
  return (
    <div>
      <Styled.Term>
        <Utility.LabelWithIcon
          label={labelText}
          icon={icon}
          textStyle={"large"}
        />
      </Styled.Term>
      <Styled.Value $block={block}>{children}</Styled.Value>
    </div>
  );
}

GroupSummaryItem.displayName = "ReadingGroup.GroupSummaryBox.Item";

GroupSummaryItem.propTypes = {
  labelText: PropTypes.string.isRequired,
  children: PropTypes.node,
  icon: PropTypes.string,
};

export default GroupSummaryItem;
