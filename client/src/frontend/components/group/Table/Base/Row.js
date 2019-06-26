import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Cell from "./Cell";

export default class TableRow extends React.PureComponent {

  static propTypes = {
    cells: PropTypes.array
  }


  get rowClassNames() {
    return classNames({
      "group-table__row": true,
      "group-table__row--body": true
    });
  }

  get rowLinkClassNames() {
    return "group-table__row-link";
  }

  get itemHeadingClassNames() {
    return classNames({
      "group-table__body-text" : true,
      "group-table__value-large": true,
    })
  }

  get rowLink() {
    return "/";
  }

  get cells() {
    return this.props.cells;
  }

  get headers() {
    return this.props.headers;
  }

  get isMobile() {
    return this.props.isMobile;
  }

  renderDesktopRow() {
    return (
      <tr
        className={this.rowClassNames}
      >
      {this.cells.map((cell, i) => {
        return (
          <Cell
            key={i}
            isMobile={this.isMobile}
            value={cell.value}
            nestedLink={cell.nestedLink}
            align={cell.align}
            textStyle={cell.textStyle}
            hoverIcon={cell.hoverIcon}
          />
        )
      })}
      </tr>
    );
  }

  renderMobileList() {

    return(
      <div className={this.rowClassNames}>
        <a className={this.rowLinkClassNames} href={this.rowLink} />
        <dl>
        {this.props.cells.map((cell, i) => {
          const cellHeaders = this.props.headers[i];
          console.log(cellHeaders, cell);
          return (
            <Cell
              key={i}
              isMobile={this.isMobile}
            />
          )
        })}
        </dl>
      </div>

    );
  }

  render() {
    return (
      <React.Fragment>
        {this.isMobile && this.renderMobileList()}
        {!this.isMobile && this.renderDesktopRow()}
      </React.Fragment>
    );
  }
}
