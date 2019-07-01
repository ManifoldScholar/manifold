import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import { TableHeaderContext } from "helpers/contexts";
import Label from "./Label";

export default class TableCell extends React.PureComponent {

  static propTypes = {
  };

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
      "group-table__body-text": true,
      "group-table__centered": this.alignment === "center",
      "group-table__right": this.alignment === "right",
      "group-table__value-large": this.textStyle === "valueLarge",
      "group-table__right-unpadded": this.cellPadding === "rightUnpadded",
      "group-table__small-padding-left": this.cellPadding === "leftSmall",
      "group-table__value-standard": !this.textStyle,
      "group-table__padded-cell": this.isTable,
      "group-table__list-value": !this.isTable,
      "group-table__cell-small": this.cellSize === "cellSmall"
    });
  }

  get listItemContainerClassNames() {
    return classNames({
      "group-table__list-item-container": !this.textStyle,
      "group-table__list-header-container": this.textStyle,
      "group-table__grid-item-right": this.columnPosition === "right",
      "group-table__grid-item-left": this.columnPosition === "left",
      "group-table__grid-item-colspan": this.columnPosition === "all",
      "group-table__grid-item-row-2": this.rowPosition === 2,
      "group-table__grid-item-row-3": this.rowPosition === 3,
      "group-table__hide-mobile": this.viewportVisibility === "hideMobile"
    });
  }

  get rowLinkClassNames() {
    return "group-table__row-link";
  }

  get link() {
    return "/";
  }

  get isTable() {
    return this.context.markup === "table";
  }

  get renderLabel() {
    return this.context.renderLabel;
  }

  render() {
    const header = this.context.getHeader(this.props.index)

    if (this.isTable) return (
      <td className={this.cellClassNames}>
        <a href={this.link} className={this.rowLinkClassNames}/>
        {this.props.children}
      </td>
   );

    return(
      <div className={this.listItemContainerClassNames}>
        {this.textStyle !== "valueLarge" &&
          <dt>
          <Label
            label={header.label}
            icon={header.icon}
          />
          </dt>
        }
        <dd className={this.cellClassNames}>
          {this.props.children}
        </dd>
      </div>
    )
  }
}
