import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import TextInner from "./TextInner";
import TextInnerStatic from "./TextInnerStatic";
import { withTranslation } from "react-i18next";

class CategoryListTexts extends PureComponent {
  static displayName = "Category.List.Texts";

  static propTypes = {
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired,
    dragging: PropTypes.string,
    t: PropTypes.func,
    categoryIndex: PropTypes.number.isRequired,
    categoryCount: PropTypes.number.isRequired
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

  get hasTexts() {
    return this.texts.length > 0;
  }

  get hasCategory() {
    return !!this.props.category;
  }

  renderEmpty() {
    return (
      <div className="texts-list__text texts-list__text--placeholder">
        <p>
          {this.hasCategory
            ? this.props.t("projects.category.empty_category")
            : this.props.t("projects.category.all_texts_categorized")}
        </p>
      </div>
    );
  }

  renderTexts() {
    return this.texts.map((text, index) => {
      const isDragging = this.props.dragging === text.id;

      return (
        <React.Fragment key={text.id}>
          <Draggable type="text" index={index} draggableId={text.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={classNames("texts-list__text", {
                  "texts-list__text--is-dragging": snapshot.isDragging
                })}
              >
                <TextInner
                  text={text}
                  index={index}
                  itemCount={this.texts.length}
                  category={this.props.category}
                  categoryIndex={this.props.categoryIndex}
                  categoryCount={this.props.categoryCount}
                  callbacks={this.callbacks}
                  onTextKeyboardMove={this.props.onTextKeyboardMove}
                  dragHandleProps={provided.dragHandleProps}
                />
              </div>
            )}
          </Draggable>
          {isDragging && (
            <div className={classNames("texts-list__text", "drag-placeholder")}>
              <TextInnerStatic text={text} category={this.props.category} />
            </div>
          )}
        </React.Fragment>
      );
    });
  }

  render() {
    return (
      <>
        {!this.hasTexts && this.renderEmpty()}
        {this.hasTexts && this.renderTexts()}
      </>
    );
  }
}

export default withTranslation()(CategoryListTexts);
