import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import classNames from "classnames";
import TextsInner from "./TextsInner";

export default class CategoryListTexts extends PureComponent {
  static displayName = "Category.List.Texts";

  static propTypes = {
    activeType: PropTypes.string,
    category: PropTypes.object,
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired
  };

  static defaultProps = {
    texts: []
  };

  get texts() {
    return this.props.texts;
  }

  get callbacks() {
    return this.props.callbacks;
  }

  get categoryId() {
    if (this.category) return this.category.id;
    return "uncategorized";
  }

  get category() {
    return this.props.category;
  }

  get noTexts() {
    return this.texts.length === 0;
  }

  render() {
    return (
      <Droppable type="text" droppableId={this.categoryId}>
        {provided => (
          <div
            ref={provided.innerRef}
            className={classNames({
              "texts-list": true,
              "texts-list--active": this.props.activeType === "text",
              "texts-list--empty": this.noTexts
            })}
          >
            <TextsInner
              callbacks={this.callbacks}
              texts={this.texts}
              category={this.category}
              onTextKeyboardMove={this.props.onTextKeyboardMove}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}
