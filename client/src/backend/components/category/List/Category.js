import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Texts from "./Texts";
import { Draggable } from "react-beautiful-dnd";
import Utility from "global/components/utility";

export default class CategoryListCategory extends PureComponent {
  static displayName = "Category.List.Category";

  static propTypes = {
    project: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    activeType: PropTypes.string,
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
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
        {provided => (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              key={this.id}
              className="text-categories__category"
            >
              <header className="text-categories__header">
                <h4 className="text-categories__label">
                  <span className="text-categories__label-type--light">
                    Category:{" "}
                  </span>
                  {this.title}
                </h4>
                <div className="text-categories__utility">
                  <button
                    className="text-categories__button text-categories__button--notice"
                    onClick={this.onDelete}
                  >
                    <Utility.IconComposer icon="trash" size={26} />
                    <span className="screen-reader-text">Delete Category</span>
                  </button>

                  <Link
                    className="text-categories__button"
                    to={lh.link(
                      "backendProjectCategory",
                      project.id,
                      category.id
                    )}
                  >
                    <Utility.IconComposer icon="pencilSimple" size={26} />
                    <span className="screen-reader-text">Edit Category</span>
                  </Link>

                  <div
                    className="text-categories__button"
                    {...provided.dragHandleProps}
                  >
                    <Utility.IconComposer
                      icon="barsDoubleHorizontal"
                      size={26}
                    />
                    <span className="screen-reader-text">Move Category</span>
                  </div>
                </div>
              </header>
              <Texts
                category={this.category}
                callbacks={this.callbacks}
                texts={this.texts}
                activeType={this.props.activeType}
              />
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}
