import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Category from "./Category";

export default class CategoryListCategories extends PureComponent {
  static displayName = "Category.List.Categories";

  static propTypes = {
    project: PropTypes.object.isRequired,
    texts: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    activeType: PropTypes.string,
    callbacks: PropTypes.object.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired
  };

  get categories() {
    return this.props.categories;
  }

  get project() {
    return this.props.project;
  }

  get callbacks() {
    return this.props.callbacks;
  }

  get activeType() {
    return this.props.activeType;
  }

  get texts() {
    return this.props.texts;
  }

  categoryTexts(category) {
    return this.texts
      .filter(
        text =>
          text.relationships.category &&
          text.relationships.category.id === category.id
      )
      .sort((a, b) => {
        return a.attributes.position - b.attributes.position;
      });
  }

  render() {
    return this.props.categories.map((category, index) => (
      <Category
        activeType={this.activeType}
        callbacks={this.callbacks}
        project={this.project}
        key={category.id}
        index={index}
        category={category}
        texts={this.categoryTexts(category)}
        onTextKeyboardMove={this.props.onTextKeyboardMove}
      />
    ));
  }
}
