import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classNames from "classnames";
import GroupSummaryItem from "./Item";

export default class GroupSummaryBox extends React.Component {

  get containerClassNames() {
    return "group-summary";
  }

  get listClassNames() {
    return "group-summary__list";
  }

  get privateIconClassNames() {
    return "group-summary__private-icon";
  }

  get group() {
    return this.props.group.attributes;
  }

  get annotationCount() {
    return this.group.annotationCount;
  }

  get memberCount() {
    return this.group.memberCount;
  }

  get role() {
    return this.group.role;
  }

  get type() {
    return this.group.type;
  }

  get highlightCount() {
    return this.group.highlightCount;
  }

  get columnLeft() {
    return "left";
  }

  get columnRight() {
    return "right";
  }

  get rowTop() {
    return "top";
  }

  get rowBottom() {
    return "bottom";
  }

  render() {

    return (
      <div className={this.containerClassNames}>
        <dl className={this.listClassNames}>
          <GroupSummaryItem
            labelText={"Type"}
            mobileColumn={this.columnLeft}
            desktopRow={this.rowTop}
          >
              {this.type}
              {this.type === "private" &&
                <Utility.IconComposer
                  icon="lock16"
                  size={16}
                  iconClass={this.privateIconClassNames}
                />
              }
          </GroupSummaryItem>
          <GroupSummaryItem
            labelText={"Your Role"}
            mobileColumn={this.columnLeft}
            desktopRow={this.rowTop}
          >
              {this.role}
          </GroupSummaryItem>
          <GroupSummaryItem
            labelText={"Members"}
            icon={"avatar24"}
            mobileColumn={this.columnRight}
            desktopRow={this.rowBottom}
            mobileRow={this.rowTop}
            mobileIndent
          >
            {this.memberCount}
          </GroupSummaryItem>
          <GroupSummaryItem
            labelText={"Annotations"}
            icon={"comment24"}
            mobileIndent
            mobileColumn={this.columnRight}
            desktopRow={this.rowBottom}
          >
            {this.annotationCount}
          </GroupSummaryItem>
          <GroupSummaryItem
            labelText={"Highlights"}
            icon={"annotate24"}
            mobileIndent
            mobileColumn={this.columnRight}
            desktopRow={this.rowBottom}
          >
            {this.highlightCount}
          </GroupSummaryItem>
        </dl>
      </div>
    )
  }
}
