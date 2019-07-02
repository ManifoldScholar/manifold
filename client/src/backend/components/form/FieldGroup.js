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
    label: PropTypes.string
  };

  static defaultProps = {
    disabled: false,
    horizontal: false,
    wide: false,
    instructions: null
  };

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
        ...childProps
      } = this.props;
      return React.cloneElement(child, childProps);
    });
  }

  render() {
    const classes = classNames({
      "form-section": true,
      disabled: this.props.disabled,
      horizontal: this.props.horizontal
    });

    return (
      <UID name={id => `field-group-${id}`}>
        {id => (
          <div
            className={classes}
            key="group"
            role="group"
            aria-labelledby={`${id}-header`}
            aria-describedby={`${id}-instructions`}
          >
            {isString(this.props.label) ? (
              <header className="form-section-label">
                <h2 id={`${id}-header`}>{this.props.label}</h2>
              </header>
            ) : null}
            <Instructions
              id={`${id}-instructions`}
              instructions={this.props.instructions}
            />
            <div className="form-input-group">
              {this.renderChildren(this.props)}
            </div>
          </div>
        )}
      </UID>
    );
  }
}
