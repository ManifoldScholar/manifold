import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";

export default class ViewHeader extends PureComponent {
  static displayName = "Layout.ViewHeader";

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    pre: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    post: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    utility: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    note: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    spaceBottom: PropTypes.bool,
    leftPadded: PropTypes.bool,
    iconAccented: PropTypes.bool,
    iconAltAccented: PropTypes.bool,
    iconRounded: PropTypes.bool,
    iconSize: PropTypes.number,
    icon: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    iconType: PropTypes.string,
    link: PropTypes.shape({ path: PropTypes.string, label: PropTypes.string })
  };

  static defaultProps = {
    spaceBottom: false
  };

  get renderedTitle() {
    const { children, count, title, subtitle, allowTitleHTML } = this.props;
    if (!isString(children) && !isEmpty(children)) return children;

    const titleValue = title || children;
    const renderTitle = allowTitleHTML ? (
      <span dangerouslySetInnerHTML={{ __html: titleValue }} />
    ) : (
      titleValue
    );

    return (
      <h1 className="backend-header__title">
        {count && <em className="backend-header__emphasis">{count} </em>}
        {renderTitle}
        {subtitle && (
          <span className="backend-header__subtitle">{subtitle}</span>
        )}
      </h1>
    );
  }

  render() {
    const {
      spaceBottom,
      icon,
      iconRounded,
      iconAccented,
      iconAltAccented,
      iconType,
      iconSize,
      link,
      className,
      pre,
      post,
      utility,
      note,
      padded
    } = this.props;

    const wrapperClasses = classNames("backend-header", className, {
      "backend-header--spaceBottom": spaceBottom
    });

    const innerClasses = classNames("backend-header__inner", {
      "backend-header__inner--padded": padded
    });

    const layoutClasses = classNames({
      "backend-header__content-flex-wrapper": !utility,
      "backend-header__content-wrapper": utility
    });

    const figureClasses = classNames("backend-header__figure", {
      "backend-header__figure--rounded": iconRounded,
      "backend-header__figure--accented": iconAccented,
      "backend-header__figure--alt-accented": iconAltAccented
    });

    const iconClasses = classNames({
      "backend-header__type-icon": iconType === "entity-type"
    });

    return (
      <header className={wrapperClasses}>
        {pre}
        <div className={innerClasses}>
          <div className={layoutClasses}>
            {icon && (
              <figure className="backend-header__figure-block">
                <div className={figureClasses}>
                  {isString(icon) ? (
                    <Utility.IconComposer
                      icon={icon}
                      size={iconSize || 34}
                      iconClass={iconClasses}
                    />
                  ) : (
                    React.Children.toArray(icon)
                  )}
                </div>
              </figure>
            )}
            <div className="backend-header__title-block">
              {this.renderedTitle}
            </div>
            {(utility || note) && (
              <div className="backend-header__utility-block">
                {utility}
                {note && <span className="backend-header__note">{note}</span>}
              </div>
            )}
            {link && (
              <div className="backend-header__utility-block backend-header__utility-block--flex">
                <Link to={link.path} className="utility-button">
                  {link.label}
                </Link>
              </div>
            )}
          </div>
        </div>
        {post}
      </header>
    );
  }
}
