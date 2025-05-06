import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import Utility from "global/components/utility";
import PopoverMenu from "global/components/popover/Menu";
import lh from "helpers/linkHandler";
import classNames from "classnames";
import { withTranslation } from "react-i18next";

class Chip extends PureComponent {
  static displayName = "Hero.Builder.ActionCallouts.Chip";

  static propTypes = {
    actionCallout: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    actionCalloutEditRoute: PropTypes.string.isRequired,
    isDragging: PropTypes.bool,
    t: PropTypes.func,
    chipCount: PropTypes.number,
    slotIndex: PropTypes.number,
    slotCount: PropTypes.number,
    onKeyboardMove: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.popoverDisclosureRef = React.createRef();
  }

  onEdit = event => {
    event.preventDefault();
    const { actionCalloutEditRoute } = this.props;
    return this.props.history.push(
      lh.link(actionCalloutEditRoute, this.modelId, this.id),
      { noScroll: true }
    );
  };

  get modelId() {
    return this.props.model.id;
  }

  get title() {
    return this.props.actionCallout.attributes.title;
  }

  get id() {
    return this.props.actionCallout.id;
  }

  get chipId() {
    return `chip-${this.id}`;
  }

  get index() {
    return this.props.index;
  }

  onKeyboardMove = direction => {
    const { actionCallout, index, slotIndex } = this.props;

    this.props.onKeyboardMove({
      callout: actionCallout,
      index,
      slotIndex,
      direction,
      callback: () => {
        // refs are unreliably here due to rerendering caused by ancestor components
        const disclosureToggleEl = document.querySelector(
          `[data-disclosure-toggle-for="${this.chipId}"]`
        );
        if (disclosureToggleEl) {
          disclosureToggleEl.focus();
        }
      }
    });
  };

  renderUtility(provided) {
    const { index, chipCount, slotIndex, slotCount } = this.props;

    return (
      <span className="action-callout-slot__chip-utility">
        <div
          className="action-callout-slot__button action-callout-slot__button--draggable"
          {...provided.dragHandleProps}
          tabIndex={-1}
        >
          <Utility.IconComposer icon="grabber32" size={24} />
        </div>
        <div className="action-callout-slot__utility-keyboard-buttons">
          <PopoverMenu
            disclosure={
              <button
                ref={this.popoverDisclosureRef}
                data-disclosure-toggle-for={this.chipId}
                className="action-callout-slot__button"
              >
                <Utility.IconComposer icon="arrowCardinals32" size={24} />
                <span className="screen-reader-text">
                  {this.props.t("actions.dnd.reorder")}
                </span>
              </button>
            }
            actions={[
              {
                id: "up",
                label: this.props.t("actions.dnd.move_up_position"),
                onClick: () => this.onKeyboardMove("up"),
                disabled: index === 0
              },
              {
                id: "down",
                label: this.props.t("actions.dnd.move_down_position"),
                onClick: () => this.onKeyboardMove("down"),
                disabled: index === chipCount - 1
              },
              {
                id: "left",
                label: this.props.t("actions.dnd.move_left_group"),
                onClick: () => this.onKeyboardMove("left"),
                disabled: slotIndex === 0
              },
              {
                id: "right",
                label: this.props.t("actions.dnd.move_right_group"),
                onClick: () => this.onKeyboardMove("right"),
                disabled: slotIndex === slotCount - 1
              }
            ]}
          />
        </div>
      </span>
    );
  }

  render() {
    return (
      <>
        <Draggable
          index={this.index}
          draggableId={this.id}
          key={this.id}
          type="actionCallout"
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={classNames({
                "action-callout-slot__chip": true,
                "action-callout-slot__chip--is-dragging": snapshot.isDragging
              })}
            >
              <div className="action-callout-slot__chip-inner">
                <button
                  onClick={this.onEdit}
                  type="button"
                  className="action-callout-slot__button"
                >
                  <span className="action-callout-slot__chip-title">
                    {this.title}
                  </span>
                </button>
                {this.renderUtility(provided)}
              </div>
            </div>
          )}
        </Draggable>
        {this.props.isDragging && (
          <div
            className={classNames(
              "action-callout-slot__chip",
              "drag-placeholder"
            )}
          >
            <div className="action-callout-slot__chip-inner">
              <span className="action-callout-slot__button">
                <span className="action-callout-slot__chip-title">
                  {this.title}
                </span>
              </span>
              <span className="action-callout-slot__chip-utility">
                <div className="action-callout-slot__button action-callout-slot__button--draggable">
                  <Utility.IconComposer icon="grabber32" size={24} />
                </div>
              </span>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default withTranslation()(Chip);
