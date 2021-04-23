import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class TableHeaders extends React.PureComponent {
  static propTypes = {
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        align: PropTypes.string,
        cellPadding: PropTypes.string
      })
    )
  };

  static displayName = "GenericTable.Headers";

  get headers() {
    return this.props.headers;
  }

  get rowClassNames() {
    return "table__row";
  }

  cellClassNames(cellPadding, cellAlignment) {
    return classNames({
      table__th: true,
      "table__small-padding-left": cellPadding === "leftSmall",
      table__centered: cellAlignment === "center",
      table__right: cellAlignment === "right"
    });
  }

  render() {
    const headers = this.headers;
    return (
      <thead>
        <tr className={this.rowClassNames}>
          {headers.map(header => {
            return (
              <th
                key={header.key}
                scope="col"
                className={this.cellClassNames(
                  header.cellPadding,
                  header.align
                )}
              >
                <Utility.LabelWithIcon
                  label={header.label}
                  icon={header.icon}
                />
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }
}
