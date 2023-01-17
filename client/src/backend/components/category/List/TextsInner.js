import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Draggable } from "react-beautiful-dnd";
import TextInner from "./TextInner";
import { withTranslation } from "react-i18next";

class CategoryListTexts extends PureComponent {
  static displayName = "Category.List.Texts";

  static propTypes = {
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    texts: []
  };

  constructor(props) {
    super(props);

    this.state = {
      dragHandleFocused: false,
      keyboardButtonFocused: false
    };
  }

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
    return this.texts.map((text, index) => (
      <Draggable type="text" index={index} key={text.id} draggableId={text.id}>
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
              category={this.props.category}
              callbacks={this.callbacks}
              onTextKeyboardMove={this.props.onTextKeyboardMove}
              dragHandleProps={provided.dragHandleProps}
            />
          </div>
        )}
      </Draggable>
    ));
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
