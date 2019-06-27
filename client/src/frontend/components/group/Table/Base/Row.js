import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableHeaderContext } from "helpers/contexts";

export default class TableRow extends React.PureComponent {

  static propTypes = {
    cells: PropTypes.array
  };

  static contextType = TableHeaderContext;

  get rowClassNames() {
    return classNames({
      "group-table__row": true,
      "group-table__row--body": true,
      "group-table__list": !this.isTable,
    });
  }

  get rowLinkClassNames() {
    return "group-table__row-link";
  }

  get itemHeadingClassNames() {
    return classNames({
      "group-table__body-text" : true,
      "group-table__value-large": true,
    })
  }

  get rowLink() {
    return "/";
  }

  get isTable() {
    return this.context.markup === "table";
  }

  render() {
    const RowComponent = this.props.rowComponent;
    const row = <RowComponent model={this.props.model} />;
    if (this.isTable) return (
      <tr
        className={this.rowClassNames}
      >
        {row}
      </tr>
    );
    return (
      <dl
        className={this.rowClassNames}
      >
        <a href={this.rowLink} className={this.rowLinkClassNames}/>
        {row}
      </dl>
    );
  }
}
