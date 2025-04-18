import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import PopoverMenu from "global/components/popover/Menu";
import { withTranslation } from "react-i18next";

class ProjectContentBlockInListPartsDrag extends PureComponent {
  static displayName = "Project.Content.Block.InList.Part.Drag";

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    baseClass: PropTypes.string.isRequired,
    dragHandleProps: PropTypes.object,
    entityCallbacks: PropTypes.object,
    index: PropTypes.number,
    entityCount: PropTypes.number,
    entityId: PropTypes.string,
    t: PropTypes.func,
    announce: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.popoverDisclosureRef = React.createRef();
  }

  onKeyboardMoveCallback = direction => {
    if (this.popoverDisclosureRef?.current) {
      this.popoverDisclosureRef.current.focus();
    }

    const translatedTitle = this.props.t(this.props.blockTitle);
    const from = this.props.index + 1;
    this.props.announce(
      this.props.t("actions.dnd.moved_to_position", {
        title: translatedTitle,
        position: direction === "up" ? from - 1 : from + 1
      })
    );
  };

  render() {
    if (!this.props.visible) return null;
    const className = `${this.props.baseClass}__icon ${this.props.baseClass}__icon--light`;

    return (
      <>
        <div
          className={`${this.props.baseClass}__button ${this.props.baseClass}__button--draggable`}
          {...this.props.dragHandleProps}
          tabIndex={-1}
        >
          <Utility.IconComposer
            icon="grabber32"
            size={26}
            className={className}
          />
        </div>
        <div className={`${this.props.baseClass}__utility-keyboard-buttons`}>
          <PopoverMenu
            disclosure={
              <button
                ref={this.popoverDisclosureRef}
                className={`${this.props.baseClass}__button`}
              >
                <Utility.IconComposer icon="arrowUpDown32" size={26} />
                <span className="screen-reader-text">
                  {this.props.t("actions.dnd.reorder")}
                </span>
              </button>
            }
            actions={[
              {
                id: "up",
                label: this.props.t("actions.dnd.move_up_position"),
                onClick: () =>
                  this.props.entityCallbacks.onKeyboardMove({
                    index: this.props.index,
                    direction: "up",
                    callback: () => this.onKeyboardMoveCallback("up")
                  }),
                disabled: this.props.index === 0
              },
              {
                id: "down",
                label: this.props.t("actions.dnd.move_down_position"),
                onClick: () =>
                  this.props.entityCallbacks.onKeyboardMove({
                    index: this.props.index,
                    direction: "down",
                    callback: () => this.onKeyboardMoveCallback("down")
                  }),
                disabled: this.props.index === this.props.entityCount - 1
              }
            ]}
          />
        </div>
      </>
    );
  }
}

export default withTranslation()(ProjectContentBlockInListPartsDrag);
