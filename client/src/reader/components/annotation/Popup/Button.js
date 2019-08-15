import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

import Authorize from "hoc/authorize";

export default class DefaultButton extends PureComponent {
  static propTypes = {
    kind: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    entity: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.array
    ]),
    ability: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.element
  };

  static defaultProps = {
    kind: "any"
  };

  renderChild() {
    return React.cloneElement(this.props.children, this.props);
  }

  render() {
    const {
      entity,
      ability,
      kind,
      className,
      onClick,
      icon,
      label
    } = this.props;

    return (
      <Authorize kind={kind} entity={entity} ability={ability}>
        {this.props.children ? (
          this.renderChild()
        ) : (
          <button
            className={classNames("annotation-popup__button", className)}
            onClick={onClick}
          >
            {icon ? (
              <IconComposer
                icon={this.props.icon}
                size={24}
                iconClass="annotation-popup__button-icon"
              />
            ) : null}
            {label}
          </button>
        )}
      </Authorize>
    );
  }
}
