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
      table__row: true,
      "table__row--body": true,
      table__list: !this.isTable
    });
  }

  get rowLinkClassNames() {
    return "table__row-link";
  }

  get itemHeadingClassNames() {
    return classNames({
      "table__body-text": true,
      "table__value-large": true
    });
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
    if (this.isTable) return <tr className={this.rowClassNames}>{row}</tr>;
    return (
      <li>
        <dl className={this.rowClassNames}>
          <a href={this.rowLink} className={this.rowLinkClassNames}>
            <span className="screen-reader-text">Visit detail view</span>
          </a>
          {row}
        </dl>
      </li>
    );
  }
}
