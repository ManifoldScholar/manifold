import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

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

  renderDesktopRow() {
    return (
      <tr
        className={this.rowClassNames}
      >
      {React.Children.map(this.props.children, (child, i) => {
        console.log(child);
        return React.cloneElement(child);
      })}
      </tr>
    );
  }

  renderMobileList() {
    console.log(this.props.rowComponent);

    return(
      <div className={this.rowClassNames}>
        <a className={this.rowLinkClassNames} href={this.rowLink} />
        <dl>
          {React.Children.map(this.props.children, (child, i) => {
            return React.cloneElement(child, { header: this.props.headers[i]});
          })}
        </dl>
      </div>

    );
  }

  render() {
    const { isMobile } = this.props;
    return (
      <React.Fragment>
        {this.renderMobileList()}
        {this.renderDesktopRow()}
      </React.Fragment>
    );
  }
}
