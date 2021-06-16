import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { TableHeaderContext } from "helpers/contexts";
import Cell from "./Cell";
import isFunction from "lodash/isFunction";
import isPlainObject from "lodash/isPlainObject";

class TableRow extends React.PureComponent {
  static displayName = "GenericTable.Row";

  static propTypes = {
    linkCreator: PropTypes.func,
    model: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  static contextType = TableHeaderContext;

  constructor(props) {
    super(props);

    this.state = { hovering: false };
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

  rowProps = () => {
    const rowClassNames = classNames({
      table__row: true,
      "table__row--is-link": this.hasRowLink,
      "table__row--is-hovering": this.state.hovering,
      table__list: !this.isTable
    });

    if (!this.hasRowLink) return { className: rowClassNames };
    return {
      onClick: event => {
        // do nothing if clicking nested link or button
        if (event.target.closest("a") || event.target.closest("button")) return;
        this.props.history.push(this.link);
      },
      onMouseOver: event => {
        // do nothing if hovering over nested link or button
        if (event.target.closest("a") || event.target.closest("button")) return;
        this.setState({ hovering: true });
      },
      onMouseOut: () => this.setState({ hovering: false }),
      className: rowClassNames
    };
  };

  cellProps(child) {
    const { _children, ...childProps } = child.props;
    return childProps;
  }

  render() {
    const { children, model } = this.props;

    const cells = React.Children.map(children.filter(Boolean), child => {
      return (
        <Cell {...this.cellProps(child)}>
          {isFunction(child.props.children)
            ? child.props.children({ model, hovering: this.state.hovering })
            : null}
        </Cell>
      );
    });

    if (this.isTable) return <tr {...this.rowProps()}>{cells}</tr>;

    return (
      <li>
        <dl {...this.rowProps()}>{cells}</dl>
      </li>
    );
  }
}

export default withRouter(TableRow);
