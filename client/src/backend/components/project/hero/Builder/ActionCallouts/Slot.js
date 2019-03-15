import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { Droppable } from "react-beautiful-dnd";
import Chip from "./Chip";

class Slot extends PureComponent {
  static displayName = "Project.Hero.Builder.ActionCallouts.Slot";

  static propTypes = {
    title: PropTypes.string.isRequired,
    attributes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    actionCallouts: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired
  };

  get title() {
    return this.props.title;
  }

  get history() {
    return this.props.history;
  }

  get attributes() {
    return this.props.attributes;
  }

  get project() {
    return this.props.project;
  }

  get actionCallouts() {
    return this.props.actionCallouts;
  }

  openNewDrawer = () => {
    const attributes = this.attributes;
    const actionCallout = { attributes };
    return this.props.history.push(
      lh.link("backendProjectActionCalloutNew", this.project.id),
      { noScroll: true, actionCallout }
    );
  };

  render() {
    return (
      <Droppable droppableId={this.props.id} type="actionCallout">
        {(provided, snapshot) => (
          <div
            className={classNames("action-callout-slot", {
              "action-callout-slot--active": snapshot.isDraggingOver
            })}
          >
            <div className="action-callout-slot__content">
              <button
                type="button"
                onClick={this.openNewDrawer}
                className="action-callout-slot__button action-callout-slot__button--header"
              >
                <Utility.IconComposer icon="circlePlus32" size={32} />
                {this.title}
              </button>
              <div
                ref={provided.innerRef}
                className="action-callout-slot__chips"
              >
                {this.actionCallouts.map((actionCallout, index) => (
                  <Chip
                    key={actionCallout.id}
                    index={index}
                    actionCallout={actionCallout}
                    history={this.history}
                    project={this.project}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          </div>
        )}
      </Droppable>
    );
  }
}

export default withRouter(Slot);
