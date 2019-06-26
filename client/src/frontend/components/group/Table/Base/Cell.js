import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class TableCell extends React.PureComponent {

  static propTypes = {
  }

  get alignment() {
    return this.props.align;
  }

  get textStyle() {
    return this.props.textStyle;
  }

  get cellClassNames() {
    return classNames({
      "group-table__body-text": true,
      "group-table__centered": this.alignment === "center",
      "group-table__value-large": this.textStyle === "valueLarge",
      "group-table__value-standard": !this.textStyle
    });
  }

  get rowLinkClassNames() {
    return "group-table__row-link";
  }

  get hoverArrowClassNames() {
    return "group-table__hover-arrow";
  }

  get nestedLinkArrowClassNames() {
    return "group-table__nested-link-arrow";
  }

  get nestedLinkClassNames() {
    return "group-table__nested-link";
  }

  get link() {
    return "/";
  }

  renderArrowIcon(iconClass, size) {
    return (
      <Utility.IconComposer
        icon="arrowRight16"
        size={size}
        iconClass={iconClass}
      />
    )
  }

  renderNestedLink() {
    return (
      <a className={this.nestedLinkClassNames} href={this.nestedLink}>
        <span>{this.props.children}</span>
        {this.renderArrowIcon(this.nestedLinkArrowClassNames, 14)}
      </a>
    );
  }

  get hoverIcon() {
    return this.props.hoverIcon;
  }

  get nestedLink() {
    return this.props.nestedLink;
  }

  renderDesktopCell() {
    return (
      <td className={this.cellClassNames}>
        <a href={this.link} className={this.rowLinkClassNames}/>
        {!this.nestedLink && this.props.children}
        {this.hoverIcon === "arrow"
          && this.renderArrowIcon(this.hoverArrowClassNames, 18)}
        {this.nestedLink && this.renderNestedLink()}
      </td>
    )
  }

  renderMobileItem() {
    return(
      <React.Fragment>

        <dt>
{this.props.header}
        </dt>
        <dl className={this.cellClassNames}>
          {this.props.children}
        </dl>
      </React.Fragment>
    )
  }

  render() {
    return(
      <React.Fragment>
        {this.renderMobileItem()}
        {this.renderDesktopCell()}
      </React.Fragment>
    )
  }
}
