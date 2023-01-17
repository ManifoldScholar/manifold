import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import classNames from "classnames";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import { withTranslation } from "react-i18next";

class CategoryList extends PureComponent {
  static displayName = "Stylesheet.List.Stylesheet";

  static propTypes = {
    stylesheet: PropTypes.object.isRequired,
    text: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  get callbacks() {
    return this.props.callbacks;
  }

  get text() {
    return this.props.text;
  }

  get stylesheet() {
    return this.props.stylesheet;
  }

  get type() {
    const t = this.props.t;
    return this.stylesheet.attributes.ingested
      ? t("texts.stylesheets.ingested")
      : t("texts.stylesheets.user_created");
  }

  get editUrl() {
    return lh.link(
      "BackendTextStylesheetEdit",
      this.text.id,
      this.stylesheet.id
    );
  }

  get index() {
    return this.props.index;
  }

  confirmDestroy = event => {
    event.preventDefault();
    this.callbacks.confirmDestroy(this.stylesheet);
  };

  render() {
    const baseClass = "ordered-records-item";
    const t = this.props.t;

    return (
      <Draggable
        type="text"
        index={this.index}
        draggableId={this.stylesheet.id}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={classNames({
              [`${baseClass}`]: true,
              [`${baseClass}--is-dragging`]: snapshot.isDragging
            })}
          >
            <div className={`${baseClass}__inner`}>
              <Link className={`${baseClass}__details`} to={this.editUrl}>
                <div className={`${baseClass}__icon`}>
                  <Utility.IconComposer icon="resourceDocument64" size={50} />
                </div>
                <div className={`${baseClass}__title-wrapper`}>
                  <h3 className={`${baseClass}__title`}>
                    {this.stylesheet.attributes.name}
                    <span className={`${baseClass}__subtitle`}>
                      {this.type}
                    </span>
                  </h3>
                  <span className={`${baseClass}__date`}>
                    <FormattedDate
                      prefix={t("dates.added_on")}
                      format="MMMM, yyyy"
                      date={this.stylesheet.attributes.createdAt}
                    />
                  </span>
                </div>
              </Link>
              <div className={`${baseClass}__utility`}>
                <button
                  className={`${baseClass}__button ${baseClass}__button--notice`}
                  onClick={this.confirmDestroy}
                >
                  <Utility.IconComposer icon="delete32" size={26} />
                  <span className="screen-reader-text">
                    {t("texts.stylesheets.delete_button_label")}
                  </span>
                </button>
                <Link className={`${baseClass}__button`} to={this.editUrl}>
                  <Utility.IconComposer icon="annotate32" size={26} />
                  <span className="screen-reader-text">
                    {t("texts.stylesheets.edit_button_label")}
                  </span>
                </Link>
                <div
                  {...provided.dragHandleProps}
                  className={`${baseClass}__button`}
                >
                  <Utility.IconComposer icon="grabber32" size={26} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}

export default withTranslation()(CategoryList);
