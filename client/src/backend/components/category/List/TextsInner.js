import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import Text from "global/components/text";
import Utility from "global/components/utility";
import classNames from "classnames";
import { Draggable } from "react-beautiful-dnd";

export default class CategoryListTexts extends PureComponent {
  static displayName = "Category.List.Texts";

  static propTypes = {
    texts: PropTypes.array.isRequired,
    callbacks: PropTypes.object.isRequired
  };

  static defaultProps = {
    texts: []
  };

  onDelete = (event, text) => {
    event.preventDefault();
    this.callbacks.destroyText(text);
  };

  labels(text) {
    const labels = [];
    if (text.attributes.ignoreAccessRestrictions) labels.push("unrestricted");
    return labels;
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
            ? "No texts have been added to this category"
            : "All texts belong to categories"}
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
            <Link
              to={lh.link("backendText", text.id)}
              className="texts-list__details"
            >
              <div className="texts-list__icon">
                <Text.Cover text={text} iconOnly={false} />
              </div>
              <div className="texts-list__title-wrapper">
                <h3 className="texts-list__title">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: text.attributes.titleFormatted
                    }}
                  />
                  <span className="texts-list__subtitle">
                    {text.attributes.subtitle}
                  </span>
                  {this.labels(text).length > 0 && (
                    <span className="texts-list__labels">
                      {this.labels(text).map(label => (
                        <span key={label} className="texts-list__label">
                          {label}
                        </span>
                      ))}
                    </span>
                  )}
                </h3>
                <span className="texts-list__date">
                  <FormattedDate
                    prefix="Added"
                    format="MMMM, yyyy"
                    date={text.attributes.createdAt}
                  />
                </span>
              </div>
            </Link>
            <div className="texts-list__utility">
              <button
                className="texts-list__button texts-list__button--notice"
                onClick={event => {
                  this.onDelete(event, text);
                }}
              >
                <Utility.IconComposer icon="delete32" size={26} />
                <span className="screen-reader-text">Delete Text</span>
              </button>
              <Link
                to={lh.link("backendText", text.id)}
                className="texts-list__button"
              >
                <Utility.IconComposer icon="annotate32" size={26} />
                <span className="screen-reader-text">Edit Text</span>
              </Link>

              <div className="texts-list__button" {...provided.dragHandleProps}>
                <Utility.IconComposer icon="grabber32" size={26} />
                <span className="screen-reader-text">Move Category</span>
              </div>
            </div>
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
