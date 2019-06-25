import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class TableHeaders extends React.PureComponent {

  static propTypes = {
  }

  get headers() {
    console.log(this.props);
    return this.props.headers;
  }

  get rowClassNames() {
    return "group-table__row";
  }

  get headingClassNames() {
    return classNames({
      "group-table__table-heading": true,
      "group-table__heading-small": true
    });
  }

  get labelIconClass() {
    return "group-table__label-icon";
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
              <td key={header.name}>
                {this.renderLabel(header.label, header.icon)}
              </td>
            )
          })}
        </tr>
      </thead>
    );
  }
}
