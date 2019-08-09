import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import GroupSummaryItem from "./Item";

export default class GroupSummaryBox extends React.Component {
  static propTypes = {
    readingGroup: PropTypes.object.isRequired
  };

  get containerClassNames() {
    return "group-summary";
  }

  get listClassNames() {
    return "group-summary__list";
  }

  get privateIconClassNames() {
    return "group-summary__private-icon";
  }

  render() {
    const { attributes } = this.props.readingGroup;
    const {
      privacy,
      highlightsCount,
      annotationsCount,
      membershipsCount,
      role
    } = attributes;

    return (
      <div className={this.containerClassNames}>
        <dl className={this.listClassNames}>
          <GroupSummaryItem
            labelText={"Type"}
            mobileColumn="left"
            desktopRow="top"
          >
            {privacy}
            {privacy === "private" && (
              <Utility.IconComposer
                icon="lock16"
                size={16}
                iconClass={this.privateIconClassNames}
              />
            )}
          </GroupSummaryItem>
          <GroupSummaryItem
            labelText={"Your Role"}
            mobileColumn="left"
            desktopRow="top"
          >
            {role}
          </GroupSummaryItem>
          <GroupSummaryItem
            labelText={"Members"}
            icon={"avatar24"}
            mobileColumn="right"
            desktopRow="bottom"
            mobileRow="top"
            mobileIndent
          >
            {membershipsCount}
          </GroupSummaryItem>
          <GroupSummaryItem
            labelText={"Annotations"}
            icon={"comment24"}
            mobileIndent
            mobileColumn="right"
            desktopRow="bottom"
          >
            {annotationsCount}
          </GroupSummaryItem>
          <GroupSummaryItem
            labelText={"Highlights"}
            icon={"annotate24"}
            mobileIndent
            mobileColumn="right"
            desktopRow="bottom"
          >
            {highlightsCount}
          </GroupSummaryItem>
        </dl>
      </div>
    );
  }
}
