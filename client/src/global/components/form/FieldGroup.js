import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import classNames from "classnames";
import { UID } from "react-uid";
import Instructions from "./Instructions";

export default class FieldGroup extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    horizontal: PropTypes.bool,
    wide: PropTypes.bool,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    label: PropTypes.string,
    labelTag: PropTypes.oneOf(["h2", "span"]),
    theme: PropTypes.oneOf(["primary", "secondary"])
  };

  static defaultProps = {
    disabled: false,
    horizontal: false,
    wide: false,
    instructions: null,
    labelTag: "h2",
    theme: "primary"
  };

  get labelTag() {
    return this.props.labelTag;
  }

  renderChildren(props) {
    return React.Children.map(props.children, child => {
      if (!child) return null;
      if (isString(child.type)) {
        return child;
      }
      const {
        horizontal,
        wide,
        label,
        instructions,
        theme,
        ...childProps
      } = this.props;
      return React.cloneElement(child, childProps);
    });
  }

  render() {
    const sectionClasses = classNames({
      "form-section": true,
      disabled: this.props.disabled,
      horizontal: this.props.horizontal,
      [`form-section--${this.props.theme}`]: true
    });
    const groupClasses = classNames({
      "form-input-group": true,
      [`form-input-group--${this.props.theme}`]: true
    });

    return (
      <UID name={id => `field-group-${id}`}>
        {id => (
          <div
            className={sectionClasses}
            key="group"
            role="group"
            aria-labelledby={`${id}-header`}
            aria-describedby={`${id}-instructions`}
          >
            {isString(this.props.label) ? (
              <header className="form-section-label">
                <this.labelTag id={`${id}-header`}>
                  {this.props.label}
                </this.labelTag>
              </header>
            ) : null}
            <Instructions
              id={`${id}-instructions`}
              instructions={this.props.instructions}
            />
            <div className={groupClasses}>
              {this.renderChildren(this.props)}
            </div>
          </div>
        )}
      </UID>
    );
  }
}
