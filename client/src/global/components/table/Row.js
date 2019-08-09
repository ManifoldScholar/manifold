import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableHeaderContext } from "helpers/contexts";
import Cell from "./Cell";
import isFunction from "lodash/isFunction";
import isPlainObject from "lodash/isPlainObject";
import { Link } from "react-router-dom";

export default class TableRow extends React.PureComponent {
  static displayName = "GenericTable.Row";

  static propTypes = {
    linkCreator: PropTypes.func,
    model: PropTypes.object.isRequired
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

  get isTable() {
    return this.context.markup === "table";
  }

  get hasRowLink() {
    const { linkCreator, model } = this.props;
    return isFunction(linkCreator) && isPlainObject(model);
  }

  get link() {
    if (!this.hasRowLink) return null;
    const { linkCreator, model } = this.props;
    return linkCreator(model);
  }

  cellProps(child) {
    const { _children, ...childProps } = child.props;
    if (this.hasRowLink) childProps.link = this.link;
    return childProps;
  }

  maybeWrapWithLink(child, className) {
    if (!this.hasRowLink) return child;
    return (
      <Link className={className} to={this.link}>
        {child}
      </Link>
    );
  }

  render() {
    const { children, model } = this.props;

    const cells = React.Children.map(children, child => (
      <Cell {...this.cellProps(child)}>{child.props.children({ model })}</Cell>
    ));

    if (this.isTable) return <tr className={this.rowClassNames}>{cells}</tr>;

    return (
      <li>
        <dl className={this.rowClassNames}>
          {this.maybeWrapWithLink(
            <span className="screen-reader-text">Visit detail view</span>,
            this.rowLinkClassNames
          )}
          {cells}
        </dl>
      </li>
    );
  }
}
