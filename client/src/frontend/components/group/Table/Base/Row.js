import React from "react";
import PropTypes from "prop-types";

export default class TableRow extends React.PureComponent {

  static propTypes = {
    cells: PropTypes.array
  }

  render() {

    return (
      <tr>
        {
          this.props.cells.map((cell) => (
            <td className="foo">
              {cell}
            </td>

          ))
        }
      </tr>
    )

  }
}
