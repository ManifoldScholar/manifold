import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class TableHeaders extends React.PureComponent {
  static propTypes = {};

  static displayName = "GenericTable.Headers";

  get headers() {
    return this.props.headers;
  }

  get rowClassNames() {
    return "table__row";
  }

  cellClassNames(cellPadding) {
    return classNames({
      "table__padded-cell": true,
      "table__small-padding-left": cellPadding === "leftSmall"
    });
  }

  render() {
    const headers = this.headers;
    return (
      <thead>
        <tr className={this.rowClassNames}>
          {headers.map(header => {
            return (
              <td
                key={header.key || header.label}
                className={this.cellClassNames(header.cellPadding)}
              >
                <Utility.LabelWithIcon
                  label={header.label}
                  icon={header.icon}
                />
              </td>
            );
          })}
        </tr>
      </thead>
    );
  }
}
