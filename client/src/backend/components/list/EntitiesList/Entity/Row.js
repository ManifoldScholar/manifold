import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import has from "lodash/has";
import LabelSet from "./LabelSet";
import { Link } from "react-router-dom";
import { UIDConsumer } from "react-uid";
import Utility from "global/components/utility";
import { withTranslation } from "react-i18next";

class EntitiesListRow extends PureComponent {
  static displayName = "List.EntitiesList.Entity.Row";

  static propTypes = {
    onRowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowClickMode: PropTypes.oneOf(["inline", "block"]),
    title: PropTypes.node,
    titlePlainText: PropTypes.string,
    count: PropTypes.node,
    meta: PropTypes.node,
    subtitle: PropTypes.node,
    figure: PropTypes.node,
    figureSize: PropTypes.oneOf(["small", "normal"]),
    figureShape: PropTypes.oneOf(["circle", "square"]),
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
      PropTypes.node
    ]),
    active: PropTypes.bool,
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare", "well"]),
    sortableStyle: PropTypes.oneOf(["tight", "spaced"]),
    utility: PropTypes.node,
    dragHandleProps: PropTypes.object,
    draggableProps: PropTypes.object,
    isDragging: PropTypes.bool,
    innerRef: PropTypes.func,
    t: PropTypes.func
  };

  static defaultProps = {
    rowClickMode: "inline",
    listStyle: "rows",
    sortableStyle: "spaced",
    figureSize: "normal",
    figureShape: "square",
    active: false
  };

  get title() {
    return this.props.title;
  }

  get subtitle() {
    return this.props.subtitle;
  }

  get count() {
    return this.props.count;
  }

  get meta() {
    return this.props.meta;
  }

  get labels() {
    const { label } = this.props;
    if (isArray(label)) return label;
    if (!label) return [];
    return [label];
  }

  get hasLabels() {
    return this.labels.length > 0;
  }

  get figure() {
    return this.props.figure;
  }

  get figureSize() {
    return this.props.figureSize;
  }

  get figureShape() {
    return this.props.figureShape;
  }

  get hasCount() {
    return has(this.props, "count");
  }

  get hasSubtitle() {
    return has(this.props, "subtitle");
  }

  get hasMeta() {
    return has(this.props, "meta");
  }

  get utility() {
    return this.props.utility;
  }

  get verticalAlignment() {
    if (this.props.figureAlign) return this.props.figureAlign;
    if (this.hasSubtitle || this.hasMeta) return "top";
    return "center";
  }

  get listStyle() {
    return this.props.listStyle;
  }

  get sortableStyle() {
    return this.props.sortableStyle;
  }

  get titlePlainText() {
    return this.props.titlePlainText || this.props.title;
  }

  get onRowClick() {
    return this.props.onRowClick;
  }

  get entireRowIsClickable() {
    return this.rowClickMode === "block" && this.onRowClick;
  }

  get active() {
    return this.props.active;
  }

  get isSortable() {
    const { draggableProps, dragHandleProps, innerRef } = this.props;
    return (
      isFunction(innerRef) &&
      draggableProps &&
      dragHandleProps &&
      !isEmpty(draggableProps) &&
      !isEmpty(dragHandleProps)
    );
  }

  get isDragging() {
    return this.props.isDragging;
  }

  get figureClassNames() {
    return classNames({
      "entity-row__figure": true,
      "entity-row__figure--valign-center": this.verticalAlignment === "center",
      "entity-row__figure--size-small": this.figureSize === "small",
      "entity-row__figure--size-medium": this.figureSize === "medium",
      "entity-row__figure--size-normal": this.figureSize === "normal",
      "entity-row__figure--shape-round": this.figureShape === "circle",
      "entity-row__figure--shape-square": this.figureShape === "square",
      "entity-row__figure--in-grid": this.listStyle === "grid",
      "entity-row__figure--in-well": this.listStyle === "well",
      "entity-row--figure--in-tiles": this.listStyle === "tiles",
      "entity-row--figure--in-rows": this.listStyle === "rows"
    });
  }

  get rowClassNames() {
    return classNames({
      "entity-row__inner": true,
      "entity-row__inner--in-grid": this.listStyle === "grid",
      "entity-row__inner--in-well": this.listStyle === "well",
      "entity-row__inner--in-tiles": this.listStyle === "tiles",
      "entity-row__inner--in-rows": this.listStyle === "rows",
      "entity-row__inner--with-row-link": this.entireRowIsClickable,
      "entity-row__inner--sortable": this.isSortable,
      "entity-row__inner--sortable-tight":
        this.isSortable && this.sortableStyle === "tight",
      "entity-row__inner--is-dragging": this.isDragging
    });
  }

  get textClassNames() {
    return classNames({
      "entity-row__text": true,
      "entity-row__text--valign-center": this.verticalAlignment === "center",
      "entity-row__text--in-grid": this.listStyle === "grid",
      "entity-row__text--in-tiles": this.listStyle === "tiles",
      "entity-row__text--in-rows": this.listStyle === "rows"
    });
  }

  get titleClassNames() {
    return classNames({
      "entity-row__title": true,
      "entity-row__title--in-grid": this.listStyle === "grid",
      "entity-row__title--in-well": this.listStyle === "well",
      "entity-row__title--in-tiles": this.listStyle === "tiles",
      "entity-row__title--in-rows": this.listStyle === "rows"
    });
  }

  get subtitleClassNames() {
    return classNames({
      "entity-row__subtitle": true,
      "entity-row__subtitle--in-grid": this.listStyle === "grid",
      "entity-row__subtitle--in-well": this.listStyle === "well",
      "entity-row__subtitle--in-tiles": this.listStyle === "tiles",
      "entity-row__subtitle--in-rows": this.listStyle === "rows"
    });
  }

  get countClassNames() {
    return classNames({
      "entity-row__count": true,
      "entity-row__count--in-grid": this.listStyle === "grid",
      "entity-row__count--in-well": this.listStyle === "well",
      "entity-row__count--in-tiles": this.listStyle === "tiles",
      "entity-row__count--in-rows": this.listStyle === "rows"
    });
  }

  get metaClassNames() {
    return classNames({
      "entity-row__meta": true,
      "entity-row__meta--in-grid": this.listStyle === "grid",
      "entity-row__meta--in-well": this.listStyle === "well",
      "entity-row__meta--in-tiles": this.listStyle === "tiles",
      "entity-row__meta--in-rows": this.listStyle === "rows"
    });
  }

  get rowClickMode() {
    return this.props.rowClickMode;
  }

  wrapWithAnchor(child, id, url, block = false) {
    const className = classNames({
      "entity-row__row-link": true,
      "entity-row__row-link--block": block,
      "entity-row__row-link--atag": true,
      "entity-row__row-link--in-grid": this.listStyle === "grid",
      "entity-row__row-link--in-well": this.listStyle === "well",
      "entity-row__row-link--is-active": this.active
    });

    return (
      <Link
        className={className}
        to={{ pathname: url, state: this.props.linkState, hash: "test" }}
        aria-describedby={`${id}-describedby`}
      >
        {child}
      </Link>
    );
  }

  wrapWithButton(child, onClick, block = false) {
    const className = classNames({
      "entity-row__row-link": true,
      "entity-row__row-link--block": block,
      "entity-row__row-link--button": true,
      "entity-row__row-link--in-grid": this.listStyle === "grid",
      "entity-row__row-link--in-well": this.listStyle === "well",
      "entity-row__row-link--is-active": this.active
    });
    return (
      <button className={className} onClick={onClick}>
        {child}
      </button>
    );
  }

  wrapWithDragHandler(child) {
    const { draggableProps, dragHandleProps, innerRef } = this.props;
    return (
      <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className="entity-row__drag-container"
      >
        {child}
      </div>
    );
  }

  wrapWithClickHandler(child, id, block = false) {
    if (!this.onRowClick) return child;
    if (isString(this.onRowClick))
      return this.wrapWithAnchor(child, id, this.onRowClick, block);
    return this.wrapWithButton(child, this.onRowClick, block);
  }

  inlineLink(child, id) {
    if (this.rowClickMode !== "inline") return child;
    return this.wrapWithClickHandler(child, id, false);
  }

  get dragHandle() {
    if (!this.isSortable) return null;
    return (
      <span className="entity-row__utility-button entity-row__utility-button--handle">
        <Utility.IconComposer icon="grabber32" size={26} />
      </span>
    );
  }

  blockLink(child, id) {
    if (this.isSortable) return this.wrapWithDragHandler(child);
    if (!this.entireRowIsClickable) return child;
    return this.wrapWithClickHandler(child, id, true);
  }

  render() {
    return (
      <UIDConsumer>
        {id => (
          <li className="entity-row entity-list__entity">
            {this.blockLink(
              <div className={this.rowClassNames}>
                {this.figure &&
                  (this.props.figureHasWrapper ? (
                    this.inlineLink(this.figure)
                  ) : (
                    <div className={this.figureClassNames}>
                      {this.inlineLink(this.figure)}
                    </div>
                  ))}
                <div className={this.textClassNames}>
                  {this.title && (
                    <h3 className={this.titleClassNames}>
                      <span className="entity-row__title-inner">
                        {this.inlineLink(this.title, id)}
                      </span>
                      {this.hasLabels && <LabelSet labels={this.labels} />}
                      <span
                        id={`${id}-describedby`}
                        className="screen-reader-text"
                      >
                        {this.props.t("actions.view_item", {
                          item:
                            typeof this.titlePlainText === "string"
                              ? this.titlePlainText
                              : "item"
                        })}
                      </span>
                    </h3>
                  )}
                  {!this.title && this.hasLabels && (
                    <LabelSet labels={this.labels} />
                  )}
                  {this.hasSubtitle && (
                    <h4 className={this.subtitleClassNames}>{this.subtitle}</h4>
                  )}
                  {this.hasCount && (
                    <h4 className={this.countClassNames}>{this.count}</h4>
                  )}
                  {this.hasMeta && (
                    <div className={this.metaClassNames}>{this.meta}</div>
                  )}
                </div>
                {(this.utility || this.isSortable) && (
                  <div className="entity-row__utility">
                    <>
                      {this.utility}
                      {this.dragHandle}
                    </>
                  </div>
                )}
              </div>,
              id
            )}
          </li>
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(EntitiesListRow);
