import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import classNames from "classnames";
import Categories from "./Categories";
import Uncategorized from "./Uncategorized";

import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { withTranslation } from "react-i18next";

class CategoryList extends PureComponent {
  static displayName = "Category.List";

  static propTypes = {
    project: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { activeType: null };
  }

  get announce() {
    return this.props.setScreenReaderStatus;
  }

  onDragStart = draggable => {
    this.setState({ activeType: draggable.type });
  };

  onDragEnd = draggable => {
    this.setState({ activeType: null });
    if (!draggable.destination) return;
    if (draggable.type === "category") this.updateCategoryPosition(draggable);
    if (draggable.type === "text")
      this.updateTextCategoryAndPosition(draggable);
  };

  determineDestination(sourceIndex, direction) {
    const isLastCategory = sourceIndex === this.categories.length - 1;
    const isUncategorized = sourceIndex === -1;

    if (isLastCategory)
      return direction === "down"
        ? undefined
        : this.categories[sourceIndex - 1];

    if (isUncategorized) return this.categories[this.categories.length - 1];

    return direction === "down"
      ? this.categories[sourceIndex + 1]
      : this.categories[sourceIndex - 1];
  }

  determinePosition(destination, direction) {
    if (direction === "down") return 1;
    const destinationTexts = this.texts.filter(
      text => text.relationships.category?.id === destination.id
    );
    return destinationTexts?.length + 1 || 1;
  }

  onTextKeyboardMove = ({ text, sourceId, direction }) => {
    const sourceIndex = this.categories.findIndex(c => c.id === sourceId);

    if (sourceId === "uncategorized" && direction === "down") {
      this.announce(this.props.t("projects.category.cannot_move_down"));
      return;
    }
    if (sourceIndex === 0 && direction === "up") {
      this.announce(this.props.t("projects.category.cannot_move_up"));
      return;
    }

    const destination = this.determineDestination(sourceIndex, direction);
    const position = this.determinePosition(destination, direction);

    this.props.callbacks.updateTextCategoryAndPosition(
      text,
      destination,
      position
    );
    this.announce(
      this.props.t("projects.category.text_moved", {
        destination: `${destination?.attributes.title || "Uncategorized"}`
      })
    );
  };

  get project() {
    return this.props.project;
  }

  get categories() {
    return this.props.categories;
  }

  get texts() {
    return this.props.texts;
  }

  get callbacks() {
    return this.props.callbacks;
  }

  get uncategorizedTexts() {
    return this.texts
      .filter(text => !text.relationships.category)
      .sort((a, b) => {
        return a.attributes.position - b.attributes.position;
      });
  }

  findText(id) {
    return this.texts.find(t => t.id === id);
  }

  findCategory(id) {
    return this.categories.find(c => c.id === id);
  }

  updateCategoryPosition(draggable) {
    const { draggableId, destination } = draggable;
    const position = destination.index + 1;
    this.props.callbacks.updateCategoryPosition(
      this.findCategory(draggableId),
      position
    );
  }

  updateTextCategoryAndPosition(draggable) {
    const { draggableId, destination } = draggable;
    const position = destination.index + 1;
    const text = this.findText(draggableId);
    const category = this.findCategory(destination.droppableId);
    this.props.callbacks.updateTextCategoryAndPosition(
      text,
      category,
      position
    );
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <section className="text-categories">
          {!!this.categories?.length && (
            <Droppable type="category" droppableId="categories">
              {provided => (
                <div
                  className={classNames({
                    "text-categories__dropzone": true,
                    "text-categories__dropzone--active":
                      this.state.activeType === "category"
                  })}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Categories
                    activeType={this.state.activeType}
                    categories={this.categories}
                    texts={this.texts}
                    project={this.project}
                    callbacks={this.callbacks}
                    onTextKeyboardMove={this.onTextKeyboardMove}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
          <Uncategorized
            callbacks={this.callbacks}
            project={this.project}
            activeType={this.state.activeType}
            texts={this.uncategorizedTexts}
            onTextKeyboardMove={this.onTextKeyboardMove}
          />
        </section>
      </DragDropContext>
    );
  }
}

export default withTranslation()(withScreenReaderStatus(CategoryList));
