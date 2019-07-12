import React from "react";
import PropTypes from "prop-types";
import TableHeaders from "./Headers";
import Row from "./Row";
import { TableHeaderContext } from "helpers/contexts";

export default class TableBody extends React.PureComponent {
  static propTypes = {
    rows: PropTypes.array
  };

  get rowComponentHeaders() {
    return this.props.rowComponent.headers();
  }

  get tableClassNames() {
    return "table__table";
  }

  render() {
    const headers = this.rowComponentHeaders;
    const label = this.props.label;
    const context = {
      getHeader: index => {
        return headers[index];
      },
      markup: this.props.markup
    };

    const rows = this.props.models.map(model => {
      return (
        <Row
          key={model.id}
          model={model}
          headers={this.headers}
          rowComponent={this.props.rowComponent}
          renderLabel={this.renderLabel}
        />
      );
    });

    return (
      <TableHeaderContext.Provider value={context}>
        {this.props.markup === "table" && (
          <table
            className={this.tableClassNames}
            aria-label={`${label} Table.`}
          >
            <TableHeaders headers={headers} />
            <tbody>{rows}</tbody>
          </table>
        )}
        {this.props.markup === "dl" && (
          <ol className="table__ordered-list" aria-label={`${label} List.`}>
            {rows}
          </ol>
        )}
      </TableHeaderContext.Provider>
    );
  }
}
