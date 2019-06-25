import React from "react";
import PropTypes from "prop-types";

export default class TableRows extends React.PureComponent {

  static propTypes = {
    rows: PropTypes.array
  }

  render() {

    return (
      <table>
        {
          this.props.rows.map((cell) => (
            <tr className="foo">
              {cell}
            </tr>

          ))
        }
      <table>
    )

  }
}
