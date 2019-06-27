import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
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
    return "group-table__table";
  }

  renderLabel(name, icon) {
    return (
      <span className={this.headingClassNames}>
        {icon && (
          <Utility.IconComposer
            icon={icon}
            size={24}
            iconClass={this.labelIconClass}
          />
        )}
        {name && name + ":"}
      </span>
    );
  }

  render() {
    const headers = this.rowComponentHeaders;
    const context = {
      getHeader: (index) => {
        return headers[index];
      },
      markup: this.props.markup,
      renderLabel: this.renderLabel
    };

    const rows = this.props.models.map((model, i)=>  {
      return(
        <Row
          key={i}
          model={model}
          headers={this.headers}
          rowComponent={this.props.rowComponent}
          renderLabel={this.renderLabel}
        />
      )
    });

    return (
      <TableHeaderContext.Provider value={context} >
        {this.props.markup === "table" &&
          <table className={this.tableClassNames} aria-hidden="true">
            <TableHeaders
              headers={headers}
              renderLabel={this.renderLabel}
            />
            <tbody>{rows}</tbody>
          </table>
        }
        {this.props.markup === "dl" && rows}
      </TableHeaderContext.Provider>
    );
  }
}
