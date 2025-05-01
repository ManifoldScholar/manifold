import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import classNames from "classnames";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import PopoverMenu from "global/components/popover/Menu";
import { withTranslation } from "react-i18next";

class StylesheetList extends PureComponent {
  static displayName = "Stylesheet.List.Stylesheet";

  static propTypes = {
    stylesheet: PropTypes.object.isRequired,
    text: PropTypes.object.isRequired,
    callbacks: PropTypes.object.isRequired,
    t: PropTypes.func,
    isDragging: PropTypes.bool,
    index: PropTypes.number,
    stylesheetCount: PropTypes.number,
    onKeyboardMove: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.popoverDisclosureRef = React.createRef();
  }

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
      this.stylesheet.id,
    );
  }

  get index() {
    return this.props.index;
  }

  confirmDestroy = (event) => {
    event.preventDefault();
    this.callbacks.confirmDestroy(this.stylesheet);
  };

  render() {
    const baseClass = "ordered-records-item";
    const { t, index, stylesheetCount, onKeyboardMove } = this.props;

    return (
      <>
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
                [`${baseClass}--is-dragging`]: snapshot.isDragging,
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
                    tabIndex={-1}
                    className={`${baseClass}__button`}
                  >
                    <Utility.IconComposer icon="grabber32" size={26} />
                  </div>
                  <div className={`${baseClass}__keyboard-buttons`}>
                    <PopoverMenu
                      disclosure={
                        <button
                          ref={this.popoverDisclosureRef}
                          className={`${baseClass}__button`}
                        >
                          <Utility.IconComposer
                            icon="arrowUpDown32"
                            size={26}
                          />
                          <span className="screen-reader-text">
                            {t("actions.dnd.reorder")}
                          </span>
                        </button>
                      }
                      actions={[
                        {
                          id: "up",
                          label: this.props.t("actions.dnd.move_up_position"),
                          onClick: () =>
                            onKeyboardMove({
                              id: this.stylesheet.id,
                              title: this.stylesheet.attributes.name,
                              index,
                              direction: "up",
                              callback: () => {
                                if (this.popoverDisclosureRef?.current) {
                                  this.popoverDisclosureRef.current.focus();
                                }
                              },
                            }),
                          disabled: index === 0,
                        },
                        {
                          id: "down",
                          label: this.props.t("actions.dnd.move_down_position"),
                          onClick: () =>
                            onKeyboardMove({
                              id: this.stylesheet.id,
                              title: this.stylesheet.attributes.name,
                              index,
                              direction: "down",
                              callback: () => {
                                if (this.popoverDisclosureRef?.current) {
                                  this.popoverDisclosureRef.current.focus();
                                }
                              },
                            }),
                          disabled: index === stylesheetCount - 1,
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Draggable>
        {this.props.isDragging && (
          <div className={classNames(baseClass, "drag-placeholder")}>
            <div className={`${baseClass}__inner`}>
              <span className={`${baseClass}__details`}>
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
              </span>
              <div className={`${baseClass}__utility`}>
                <button
                  className={`${baseClass}__button ${baseClass}__button--notice`}
                >
                  <Utility.IconComposer icon="delete32" size={26} />
                  <span className="screen-reader-text">
                    {t("texts.stylesheets.delete_button_label")}
                  </span>
                </button>
                <span className={`${baseClass}__button`}>
                  <Utility.IconComposer icon="annotate32" size={26} />
                  <span className="screen-reader-text">
                    {t("texts.stylesheets.edit_button_label")}
                  </span>
                </span>
                <div className={`${baseClass}__button`}>
                  <Utility.IconComposer icon="grabber32" size={26} />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default withTranslation()(StylesheetList);
