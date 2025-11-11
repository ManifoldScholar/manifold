import { useState, useContext, useMemo, Children } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { TableHeaderContext } from "helpers/contexts";
import Cell from "./Cell";
import isFunction from "lodash/isFunction";
import isPlainObject from "lodash/isPlainObject";

export default function TableRow({ linkCreator, model, children }) {
  const navigate = useNavigate();
  const context = useContext(TableHeaderContext);
  const [hovering, setHovering] = useState(false);

  const isTable = context.markup === "table";
  const hasRowLink = isFunction(linkCreator) && isPlainObject(model);
  const link = hasRowLink ? linkCreator(model) : null;

  const rowProps = useMemo(() => {
    const rowClassNames = classNames({
      table__row: true,
      "table__row--is-link": hasRowLink,
      "table__row--is-hovering": hovering,
      table__list: !isTable
    });

    if (!hasRowLink) return { className: rowClassNames };
    return {
      onClick: event => {
        // do nothing if clicking nested link or button
        if (event.target.closest("a") || event.target.closest("button")) return;
        navigate(link);
      },
      onMouseOver: event => {
        // do nothing if hovering over nested link or button
        if (event.target.closest("a") || event.target.closest("button")) return;
        setHovering(true);
      },
      onMouseOut: () => setHovering(false),
      className: rowClassNames
    };
  }, [hasRowLink, hovering, isTable, link, navigate]);

  const cells = useMemo(() => {
    const getCellProps = child => {
      const { _children, ...childProps } = child.props;
      return childProps;
    };
    return Children.map(children.filter(Boolean), child => {
      return (
        <Cell {...getCellProps(child)}>
          {isFunction(child.props.children)
            ? child.props.children({ model, hovering })
            : null}
        </Cell>
      );
    });
  }, [children, model, hovering]);

  if (isTable) return <tr {...rowProps}>{cells}</tr>;

  return (
    <li>
      <dl {...rowProps}>{cells}</dl>
    </li>
  );
}

TableRow.displayName = "GenericTable.Row";

TableRow.propTypes = {
  linkCreator: PropTypes.func,
  model: PropTypes.object.isRequired,
  children: PropTypes.node
};
