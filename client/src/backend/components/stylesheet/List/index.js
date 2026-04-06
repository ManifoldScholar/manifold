import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  DragDropContext,
  Droppable
} from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import classNames from "classnames";
import Stylesheet from "./Stylesheet";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { withTranslation } from "react-i18next";

class StylesheetList extends Component {
  static displayName = "Stylesheet.List";

  static propTypes = {
    text: PropTypes.object,
    stylesheets: PropTypes.array,
    callbacks: PropTypes.object.isRequired
  };

  static getDerivedStateFromProps(props, state = {}) {
    if (props.text === state.text) return null;
    return {
      text: props.text,
      stylesheets: props.stylesheets.slice(0)
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
      ...this.constructor.getDerivedStateFromProps(props)
    };
  }

  onDragStart = draggableIgnored => {
    this.setState({ dragging: true });
  };

  onDragEnd = draggable => {
    this.setState({ dragging: false });
    if (!draggable.destination) return;
    const stylesheet = this.findStylesheet(draggable.draggableId);
    const index = draggable.destination.index;
    if (!stylesheet) return;
    this.updateInternalState(stylesheet, index);
    this.callbacks.updatePosition(stylesheet, index + 1);
  };

  onKeyboardMove = ({ id, title, index, direction, ...rest }) => {
    const stylesheet = this.findStylesheet(id);
    const newIndex = direction === "down" ? index + 1 : index - 1;

    this.updateInternalState(stylesheet, newIndex);

    const announcement = this.props.t("actions.dnd.moved_to_position", {
      title,
      position: newIndex + 1
    });
    const callback = () => {
      this.props.setScreenReaderStatus(announcement);

      if (rest.callback && typeof rest.callback === "function") {
        rest.callback();
      }
    };
    this.callbacks.updatePosition(stylesheet, newIndex + 1, callback);
  };

  get stylesheets() {
    return this.state.stylesheets;
  }

  get text() {
    return this.props.text;
  }

  get callbacks() {
    return this.props.callbacks;
  }

  findStylesheet(id) {
    return this.stylesheets.find(ss => ss.id === id);
  }

  updateInternalState(stylesheet, index) {
    const stylesheets = this.stylesheets.filter(ss => ss.id !== stylesheet.id);
    stylesheets.splice(index, 0, stylesheet);
    this.setState({ stylesheets });
  }

  render() {
    return (
      <>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          <section className="ordered-records rbd-migration-resets">
            <Droppable type="category" droppableId="categories">
              {(provided, snapshot) => (
                <div
                  className={classNames({
                    "ordered-records__dropzone": true,
                    "ordered-records__dropzone--active": this.state.dragging
                  })}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {this.stylesheets.map((stylesheet, index) => (
                    <Stylesheet
                      index={index}
                      text={this.text}
                      callbacks={this.callbacks}
                      stylesheet={stylesheet}
                      key={stylesheet.id}
                      isDragging={
                        snapshot.draggingFromThisWith === stylesheet.id
                      }
                      stylesheetCount={this.stylesheets.length}
                      onKeyboardMove={this.onKeyboardMove}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>
        </DragDropContext>
        {this.props.renderLiveRegion("alert")}
      </>
    );
  }
}

export default withTranslation()(withScreenReaderStatus(StylesheetList, false));
