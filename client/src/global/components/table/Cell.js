import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import { TableHeaderContext } from "helpers/contexts";

export default class TableCell extends React.PureComponent {
  static propTypes = {};

  static contextType = TableHeaderContext;

  get alignment() {
    return this.props.align;
  }

  get textStyle() {
    return this.props.textStyle;
  }

  get columnPosition() {
    return this.props.columnPosition;
  }

  get rowPosition() {
    return this.props.rowPosition;
  }

  get cellPadding() {
    return this.props.cellPadding;
  }

  get viewportVisibility() {
    return this.props.viewportVisibility;
  }

  get cellSize() {
    return this.props.cellSize;
  }

  get cellClassNames() {
    return classNames({
      "table__body-text": true,
      table__centered: this.alignment === "center",
      table__right: this.alignment === "right",
      "table__value-large": this.textStyle === "valueLarge",
      "table__right-unpadded": this.cellPadding === "rightUnpadded",
      "table__small-padding-left": this.cellPadding === "leftSmall",
      "table__value-standard": !this.textStyle,
      "table__padded-cell": this.isTable,
      "table__list-value": !this.isTable,
      "table__cell-small": this.cellSize === "cellSmall",
      "table__cell-medium": this.cellSize === "cellMedium"
    });
  }

  get listItemContainerClassNames() {
    return classNames({
      "table__list-item-container": !this.textStyle,
      "table__list-header-container": this.textStyle,
      "table__grid-item-right": this.columnPosition === "right",
      "table__grid-item-left": this.columnPosition === "left",
      "table__grid-item-colspan": this.columnPosition === "all",
      "table__grid-item-row-2": this.rowPosition === 2,
      "table__grid-item-row-3": this.rowPosition === 3,
      "table__hide-mobile": this.viewportVisibility === "hideMobile"
    });
  }

  get rowLinkClassNames() {
    return "table__row-link";
  }

  get link() {
    return "/";
  }

  get isTable() {
    return this.context.markup === "table";
  }

  render() {
    const header = this.context.getHeader(this.props.index);

    if (this.isTable)
      return (
        <td className={this.cellClassNames}>
          <a href={this.link} className={this.rowLinkClassNames}>
            <span className="screen-reader-text">Visit detail view</span>
          </a>
          {this.props.children}
        </td>
      );

    return (
      <div className={this.listItemContainerClassNames}>
        {this.textStyle !== "valueLarge" && (
          <dt>
            <Utility.LabelWithIcon label={header.label} icon={header.icon} />
          </dt>
        )}
        <dd className={this.cellClassNames}>{this.props.children}</dd>
      </div>
    );
  }
}
