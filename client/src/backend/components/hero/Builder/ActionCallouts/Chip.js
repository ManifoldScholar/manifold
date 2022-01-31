import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import classNames from "classnames";

export default class Chip extends PureComponent {
  static displayName = "Hero.Builder.ActionCallouts.Chip";

  static propTypes = {
    actionCallout: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    actionCalloutEditRoute: PropTypes.string.isRequired
  };

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

  get index() {
    return this.props.index;
  }

  render() {
    return (
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
              <span className="action-callout-slot__chip-utility">
                <div
                  className="action-callout-slot__button action-callout-slot__button--draggable"
                  {...provided.dragHandleProps}
                >
                  <Utility.IconComposer icon="grabber32" size={24} />
                </div>
              </span>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}
