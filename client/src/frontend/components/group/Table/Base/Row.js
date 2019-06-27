import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableHeaderContext } from "helpers/contexts";

export default class TableRow extends React.PureComponent {

  static propTypes = {
    cells: PropTypes.array
  };

  static contextType = TableHeaderContext;

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

  lookupHeader = (index) => {
    return "foo"
  };

  get rowLink() {
    return "/";
  }

  // renderDesktopRow() {
  //   return (
  //     <tr
  //       className={this.rowClassNames}
  //     >
  //     {React.Children.map(this.props.children, (child, i) => {
  //       console.log(child);
  //       return React.cloneElement(child);
  //     })}
  //     </tr>
  //   );
  // }
  //
  // renderMobileList() {
  //   console.log(this.props.rowComponent);
  //
  //   return(
  //     <div className={this.rowClassNames}>
  //       <a className={this.rowLinkClassNames} href={this.rowLink} />
  //       <dl>
  //         {React.Children.map(this.props.children, (child, i) => {
  //           return React.cloneElement(child, { header: this.props.headers[i]});
  //         })}
  //       </dl>
  //     </div>
  //
  //   );
  // }

  render() {
    const RowComponent = this.props.rowComponent;
    const isTable = this.context.markup === "table";
    const row = <RowComponent model={this.props.model} />;
    if (isTable) return (
      <tr
        className={this.rowClassNames}
      >
        {row}
      </tr>
    );
    return (
      <dl style={{ border: "1px solid green"}}>
        {row}
      </dl>
    );
  }
}
