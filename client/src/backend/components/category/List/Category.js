import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Texts from "./Texts";
import { Draggable } from "react-beautiful-dnd";
import Utility from "global/components/utility";
import classNames from "classnames";
import { withTranslation } from "react-i18next";

class CategoryListCategory extends PureComponent {
  static displayName = "Category.List.Category";

  static propTypes = {
    project: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    activeType: PropTypes.string,
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultProps = {
    texts: []
  };

  onDelete = event => {
    event.preventDefault();
    this.callbacks.destroyCategory(this.category);
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

  get id() {
    return this.category.id;
  }

  get title() {
    return this.category.attributes.title;
  }

  render() {
    const category = this.category;
    const project = this.project;

    return (
      <Draggable type="category" index={this.props.index} draggableId={this.id}>
        {(provided, snapshot) => (
          <>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              key={this.id}
              className={classNames({
                "text-categories__category": true,
                "text-categories__category--is-dragging": snapshot.isDragging
              })}
            >
              <header className="text-categories__header">
                <h2 className="text-categories__label">
                  <span className="text-categories__label-type--light">
                    {this.props.t("glossary.category_title_case_one") + ": "}
                  </span>
                  {this.title}
                </h2>
                <div className="text-categories__utility">
                  <button
                    className="text-categories__button text-categories__button--notice"
                    onClick={this.onDelete}
                  >
                    <Utility.IconComposer icon="delete32" size={26} />
                    <span className="screen-reader-text">
                      {this.props.t("projects.category.delete")}
                    </span>
                  </button>

                  <Link
                    className="text-categories__button"
                    to={lh.link(
                      "backendProjectCategory",
                      project.id,
                      category.id
                    )}
                  >
                    <Utility.IconComposer icon="annotate32" size={26} />
                    <span className="screen-reader-text">
                      {this.props.t("projects.category.edit")}
                    </span>
                  </Link>

                  <div
                    className="text-categories__button"
                    {...provided.dragHandleProps}
                  >
                    <Utility.IconComposer icon="grabber32" size={26} />
                    <span className="screen-reader-text">
                      {this.props.t("projects.category.drag")}
                    </span>
                  </div>
                </div>
              </header>
              <Texts
                category={this.category}
                callbacks={this.callbacks}
                texts={this.texts}
                activeType={this.props.activeType}
                onTextKeyboardMove={this.props.onTextKeyboardMove}
              />
            </div>
            {provided.placeholder}
          </>
        )}
      </Draggable>
    );
  }
}

export default withTranslation()(CategoryListCategory);
