import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import { TableHeaderContext } from "helpers/contexts";
import isNil from "lodash/isNil";

export default class TableCell extends React.PureComponent {
  static propTypes = {
    align: PropTypes.oneOf(["center", "right", "left"]),
    textStyle: PropTypes.oneOf(["valueLarge"]),
    cellPadding: PropTypes.oneOf(["rightUnpadded", "leftSmall"]),
    cellSize: PropTypes.oneOf(["cellTruncate", "cellFitContent"]),
    columnPosition: PropTypes.oneOf(["all", "left", "right"]),
    viewportVisibility: PropTypes.oneOf(["hideMobile"]),
    maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  static defaultProps = {
    align: "left"
  };

  static displayName = "GenericTable.Cell";

  static contextType = TableHeaderContext;

  get cellClassNames() {
    const { align, textStyle, cellPadding, cellSize, headerIcon } = this.props;
    return classNames({
      "table__body-text": true,
      table__centered: align === "center",
      table__right: align === "right",
      "table__value-large": textStyle === "valueLarge",
      "table__right-unpadded": cellPadding === "rightUnpadded",
      "table__small-padding-left": cellPadding === "leftSmall",
      "table__value-standard": !textStyle,
      "table__padded-cell": this.isTable,
      "table__list-value": !this.isTable,
      "table__cell--fit-content": cellSize === "cellFitContent",
      "table__cell--truncate": cellSize === "cellTruncate",
      "table__cell--header-has-icon": !isNil(headerIcon)
    });
  }

  get listItemContainerClassNames() {
    const {
      columnPosition,
      rowPosition,
      textStyle,
      viewportVisibility
    } = this.props;
    return classNames({
      "table__list-item-container": !textStyle,
      "table__list-header-container": textStyle,
      "table__grid-item-right": columnPosition === "right",
      "table__grid-item-left": columnPosition === "left",
      "table__grid-item-colspan": columnPosition === "all",
      "table__grid-item-row-2": rowPosition === 2,
      "table__grid-item-row-3": rowPosition === 3,
      "table__hide-mobile": viewportVisibility === "hideMobile"
    });
  }

  get isTable() {
    return this.context.markup === "table";
  }

  get tdStyle() {
    const { maxWidth } = this.props;
    return maxWidth ? { maxWidth } : {};
  }

  render() {
    const { header, headerIcon } = this.props;

    if (this.isTable)
      return (
        <td className={this.cellClassNames} style={this.tdStyle}>
          {this.props.children}
        </td>
      );

    return (
      <div className={this.listItemContainerClassNames}>
        {this.textStyle !== "valueLarge" && (
          <dt>
            <Utility.LabelWithIcon label={header} icon={headerIcon} />
          </dt>
        )}
        <dd className={this.cellClassNames}>{this.props.children}</dd>
      </div>
    );
  }
}
