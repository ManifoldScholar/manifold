import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableHeaderContext } from "helpers/contexts";
import Cell from "./Cell";

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
    const { children } = this.props;

    const cells = React.Children.map(children, child => {
      const { children, ...childProps } = child.props;
      return (
        <Cell {...childProps}>{children({ model: this.props.model })}</Cell>
      );
    });

    if (this.isTable) return <tr className={this.rowClassNames}>{cells}</tr>;
    return (
      <li>
        <dl className={this.rowClassNames}>
          <a href={this.rowLink} className={this.rowLinkClassNames}>
            <span className="screen-reader-text">Visit detail view</span>
          </a>
          {cells}
        </dl>
      </li>
    );
  }
}
