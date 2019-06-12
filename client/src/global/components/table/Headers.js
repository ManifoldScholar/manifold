import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class TableHeaders extends React.PureComponent {

  static propTypes = {
  }

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

  get renderLabel() {
    return this.props.renderLabel;
  }

  render() {
    const headers = this.headers;
    return (
      <thead>
        <tr className={this.rowClassNames}>
          {headers.map(header => {
            return(
              <td
                key={header.name}
                className={this.cellClassNames(header.cellPadding)}
              >
                <Utility.LabelWithIcon
                  label={header.label}
                  icon={header.icon}
                />
              </td>
            )
          })}
        </tr>
      </thead>
    );
  }
}
