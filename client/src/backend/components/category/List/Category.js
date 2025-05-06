import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Texts from "./Texts";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import Utility from "global/components/utility";
import PopoverMenu from "global/components/popover/Menu";
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
    categoryCount: PropTypes.number.isRequired,
    onTextKeyboardMove: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    texts: []
  };

  constructor(props) {
    super(props);

    this.popoverDisclosureRef = React.createRef();
  }

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
    const {
      index,
      categoryCount,
      callbacks: { updateCategoryPosition }
    } = this.props;

    return (
      <>
        <Draggable
          type="category"
          index={this.props.index}
          draggableId={this.id}
        >
          {(provided, snapshot) => (
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
                    tabIndex={-1}
                  >
                    <Utility.IconComposer icon="grabber32" size={26} />
                    <span className="screen-reader-text">
                      {this.props.t("projects.category.drag")}
                    </span>
                  </div>
                  <div className="text-categories__keyboard-buttons">
                    <PopoverMenu
                      disclosure={
                        <button
                          ref={this.popoverDisclosureRef}
                          className="text-categories__button"
                        >
                          <Utility.IconComposer
                            icon="arrowUpDown32"
                            size={26}
                          />
                          <span className="screen-reader-text">
                            {this.props.t("actions.dnd.reorder")}
                          </span>
                        </button>
                      }
                      actions={[
                        {
                          id: "up_category",
                          label: this.props.t("actions.dnd.move_up_category"),
                          onClick: () =>
                            updateCategoryPosition(
                              category,
                              index + 1 - 1,
                              () => {
                                if (this.popoverDisclosureRef?.current) {
                                  this.popoverDisclosureRef.current.focus();
                                }
                              },
                              true
                            ), // index starts with 0, positions start with 1
                          disabled: index === 0
                        },
                        {
                          id: "down_category",
                          label: this.props.t("actions.dnd.move_down_category"),
                          onClick: () =>
                            updateCategoryPosition(
                              category,
                              index + 1 + 1,
                              () => {
                                if (this.popoverDisclosureRef?.current) {
                                  this.popoverDisclosureRef.current.focus();
                                }
                              },
                              true
                            ), // index starts with 0, positions start with 1
                          disabled: index === categoryCount - 2 // subtract 1 for Uncategorized, which can't move
                        }
                      ]}
                    />
                  </div>
                </div>
              </header>
              <Texts
                category={this.category}
                categoryIndex={this.props.index}
                categoryCount={this.props.categoryCount}
                callbacks={this.callbacks}
                texts={this.texts}
                activeType={this.props.activeType}
                onTextKeyboardMove={this.props.onTextKeyboardMove}
              />
            </div>
          )}
        </Draggable>
        {this.props.isDragging && (
          <div
            className={classNames(
              "text-categories__category",
              "drag-placeholder"
            )}
          >
            <header className="text-categories__header">
              <h2 className="text-categories__label">
                <span className="text-categories__label-type--light">
                  {this.props.t("glossary.category_title_case_one") + ": "}
                </span>
                {this.title}
              </h2>
              <div className="text-categories__utility">
                <span className="text-categories__button text-categories__button--notice">
                  <Utility.IconComposer icon="delete32" size={26} />
                  <span className="screen-reader-text">
                    {this.props.t("projects.category.delete")}
                  </span>
                </span>
                <span className="text-categories__button">
                  <Utility.IconComposer icon="annotate32" size={26} />
                </span>
                <div className="text-categories__button">
                  <Utility.IconComposer icon="grabber32" size={26} />
                </div>
              </div>
            </header>
            <Texts
              category={this.category}
              callbacks={this.callbacks}
              texts={this.texts}
              activeType={this.props.activeType}
              onTextKeyboardMove={this.props.onTextKeyboardMove}
              categoryIndex={this.props.index}
              categoryCount={this.props.categoryCount}
            />
          </div>
        )}
      </>
    );
  }
}

export default withTranslation()(CategoryListCategory);
