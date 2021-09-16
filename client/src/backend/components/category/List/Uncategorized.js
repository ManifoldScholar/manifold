import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Texts from "./Texts";

export default class CategoryListUncategorized extends PureComponent {
  static displayName = "Category.List.Uncategorized";

  static propTypes = {
    activeType: PropTypes.string,
    project: PropTypes.object.isRequired,
    category: PropTypes.object,
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired
  };

  static defaultProps = {
    texts: []
  };

  get category() {
    return this.props.category;
  }

  get project() {
    return this.props.project;
  }

  get texts() {
    return this.props.texts;
  }

  get callbacks() {
    return this.props.callbacks;
  }

  render() {
    return (
      <div className="text-categories__category">
        <header className="text-categories__header">
          <h2 className="text-categories__label">
            <span className="text-categories__label--notice">
              Uncategorized
            </span>
          </h2>
        </header>
        <Texts
          activeType={this.props.activeType}
          callbacks={this.callbacks}
          texts={this.texts}
          onTextKeyboardMove={this.props.onTextKeyboardMove}
        />
      </div>
    );
  }
}
