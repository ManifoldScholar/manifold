import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import { TableHeaderContext } from "helpers/contexts";

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

  get column() {
    return this.props.column;
  }

  get row() {
    return this.props.row;
  }

  get cellPadding() {
    return this.props.cellPadding;
  }

  get cellClassNames() {
    return classNames({
      "group-table__body-text": true,
      "group-table__centered": this.alignment === "center",
      "group-table__value-large": this.textStyle === "valueLarge",
      "group-table__no-left-padding": this.cellPadding === "noLeft",
      "group-table__value-standard": !this.textStyle,
      "group-table__padded-cell": this.isTable,
      "group-table__list-value": !this.isTable
    });
  }

  get listItemContainerClassNames() {
    return classNames({
      "group-table__list-item-container": !this.textStyle,
      "group-table__list-header-container": this.textStyle,
      "group-table__grid-item-right": this.column === "right",
      "group-table__grid-item-left": this.column === "left",
      "group-table__grid-item-colspan": this.column == "all",
      "group-table__grid-item-top-align": this.row === 2
    });
  }

  get rowLinkClassNames() {
    return "group-table__row-link";
  }

  get hoverArrowClassNames() {
    return "group-table__hover-arrow";
  }

  get labelIconClass() {
    return "group-table__label-icon";
  }

  get headingClassNames() {
    return classNames({
      "group-table__table-heading": true,
      "group-table__heading-small": true,
    });
  }

  get link() {
    return "/";
  }

  get hoverIcon() {
    return this.props.hoverIcon;
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
        {this.hoverIcon === "arrow" &&
        <Utility.IconComposer
          icon="arrowRight16"
          size={18}
          iconClass={this.hoverArrowClassNames}
        />}
      </td>
   );

    return(
      <div className={this.listItemContainerClassNames}>
        {this.textStyle !== "valueLarge" &&
          <dt>
            {this.renderLabel(header.label, header.icon)}
          </dt>
        }
        <dd className={this.cellClassNames}>
          {this.props.children}
        </dd>
      </div>
    )
  }
}
