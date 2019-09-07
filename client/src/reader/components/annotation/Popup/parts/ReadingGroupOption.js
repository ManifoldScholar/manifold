import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class ReadingGroupOption extends PureComponent {
  static displayName = "Annotation.Popup.ReadingGroupOption";

  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    privateGroup: PropTypes.bool
  };

  render() {
    const { label, onClick, privateGroup, selected } = this.props;
    return (
      <li className="annotation-group-options__option">
        <button
          type="button"
          onClick={onClick}
          className="annotation-group-options__button"
        >
          <div className="annotation-group-options__button-inner">
            {selected && (
              <IconComposer
                icon="checkmark16"
                size={22}
                iconClass="annotation-group-options__icon annotation-group-options__icon--selected"
              />
            )}
            <span className="annotation-group-options__button-text">
              {label}
            </span>
            {privateGroup && (
              <IconComposer
                icon="lock16"
                size={18}
                iconClass="annotation-group-options__icon annotation-group-options__icon--private"
              />
            )}
          </div>
        </button>
      </li>
    );
  }
}
