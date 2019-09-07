import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classNames from "classnames";

export default class GroupSummaryItem extends React.Component {
  get mobileColumn() {
    return this.props.mobileColumn;
  }

  get mobileRow() {
    return this.props.mobileRow;
  }

  get desktopRow() {
    return this.props.desktopRow;
  }

  get mobileIndent() {
    return this.props.mobileIndent;
  }

  get listItemContainerClassNames() {
    return classNames({
      "group-summary__item-container": true,
      "group-summary__mobile-left": this.mobileColumn === "left",
      "group-summary__mobile-right": this.mobileColumn === "right",
      "group-summary__mobile-top": this.mobileRow === "top",
      "group-summary__desktop-top": this.desktopRow === "top",
      "group-summary__desktop-bottom": this.desktopRow === "bottom"
    });
  }

  get listLabelClassNames() {
    return classNames({
      "group-summary__item": true,
      "group-summary__label": true
    });
  }

  get listValueClassNames() {
    return classNames({
      "group-summary__item": true,
      "group-summary__value": true,
      "group-summary__mobile-indent": this.mobileIndent
    });
  }

  get labelText() {
    return this.props.labelText;
  }

  get icon() {
    return this.props.icon;
  }

  render() {
    return (
      <div className={this.listItemContainerClassNames}>
        <dt className={this.listLabelClassNames}>
          <Utility.LabelWithIcon
            label={this.labelText}
            icon={this.icon}
            textStyle={"large"}
          />
        </dt>
        <dd className={this.listValueClassNames}>{this.props.children}</dd>
      </div>
    );
  }
}
