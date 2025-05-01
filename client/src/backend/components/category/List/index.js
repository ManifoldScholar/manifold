import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  DragDropContext,
  Droppable,
} from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import classNames from "classnames";
import Categories from "./Categories";
import Uncategorized from "./Uncategorized";
import { withTranslation } from "react-i18next";

class CategoryList extends PureComponent {
  static displayName = "Category.List";

  static propTypes = {
    project: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired,
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { activeType: null };
  }

  onDragStart = (draggable) => {
    this.setState({ activeType: draggable.type });
  };

  onDragEnd = (draggable) => {
    this.setState({ activeType: null });
    if (!draggable.destination) return;
    if (draggable.type === "category") this.updateCategoryPosition(draggable);
    if (draggable.type === "text")
      this.updateTextCategoryAndPosition(draggable);
  };

  onTextKeyboardMove = ({ text, destinationIndex, position }, callback) => {
    const destinationIsUncategorized =
      destinationIndex === this.categories.length + 1;
    const destination = destinationIsUncategorized
      ? undefined
      : this.categories[destinationIndex];

    this.props.callbacks.updateTextCategoryAndPosition(
      text,
      destination,
      position,
      callback,
      true,
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
      .filter((text) => !text.relationships.category)
      .sort((a, b) => {
        return a.attributes.position - b.attributes.position;
      });
  }

  findText(id) {
    return this.texts.find((t) => t.id === id);
  }

  findCategory(id) {
    return this.categories.find((c) => c.id === id);
  }

  updateCategoryPosition(draggable) {
    const { draggableId, destination } = draggable;
    const position = destination.index + 1;
    this.props.callbacks.updateCategoryPosition(
      this.findCategory(draggableId),
      position,
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
      position,
    );
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <section className="text-categories rbd-migration-resets">
          {!!this.categories?.length && (
            <Droppable type="category" droppableId="categories">
              {(provided, snapshot) => (
                <div
                  className={classNames({
                    "text-categories__dropzone": true,
                    "text-categories__dropzone--active":
                      this.state.activeType === "category",
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
                    dragging={snapshot.draggingFromThisWith}
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
            categoryCount={this.categories.length}
          />
        </section>
      </DragDropContext>
    );
  }
}

export default withTranslation()(CategoryList);
