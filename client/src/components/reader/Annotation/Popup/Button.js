import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import HigherOrder from "containers/global/HigherOrder";

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
    iconClass: PropTypes.string,
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
      iconClass,
      label
    } = this.props;
    const iconClassName = classNames("manicon", iconClass);
    return (
      <HigherOrder.Authorize kind={kind} entity={entity} ability={ability}>
        {this.props.children ? (
          this.renderChild()
        ) : (
          <button className={className} onClick={onClick}>
            {iconClass ? <i className={iconClassName} /> : null}
            {label}
          </button>
        )}
      </HigherOrder.Authorize>
    );
  }
}
