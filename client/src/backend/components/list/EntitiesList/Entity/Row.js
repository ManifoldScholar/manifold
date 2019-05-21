import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import LabelSet from "./LabelSet";
import { Link } from "react-router-dom";
import labelId from "helpers/labelId";

export default class EntitiesListRow extends PureComponent {
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
      PropTypes.array,
      PropTypes.node
    ]),
    active: PropTypes.bool,
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid"]),
    utility: PropTypes.node,
    isSortable: PropTypes.bool
  };

  static defaultProps = {
    isSortable: false,
    rowClickMode: "inline",
    listStyle: "rows",
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
    return !!this.count;
  }

  get hasSubtitle() {
    return !!this.subtitle;
  }

  get hasMeta() {
    return !!this.meta;
  }

  get utility() {
    return this.props.utility;
  }

  get verticalAlignment() {
    if (this.hasSubtitle || this.hasMeta) return "top";
    return "center";
  }

  get listStyle() {
    return this.props.listStyle;
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

  get figureClassNames() {
    return classNames({
      "entity-row__figure": true,
      "entity-row__figure--valign-center": this.verticalAlignment === "center",
      "entity-row__figure--size-small": this.figureSize === "small",
      "entity-row__figure--size-normal": this.figureSize === "normal",
      "entity-row__figure--shape-round": this.figureShape === "circle",
      "entity-row__figure--shape-square": this.figureShape === "square",
      "entity-row__figure--in-grid": this.listStyle === "grid",
      "entity-row--figure--in-tiles": this.listStyle === "tiles",
      "entity-row--figure--in-rows": this.listStyle === "rows"
    });
  }

  get rowClassNames() {
    return classNames({
      "entity-row__inner": true,
      "entity-row__inner--in-grid": this.listStyle === "grid",
      "entity-row__inner--in-tiles": this.listStyle === "tiles",
      "entity-row__inner--in-rows": this.listStyle === "rows",
      "entity-row__inner--with-row-link": this.entireRowIsClickable
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
      "entity-row__title--in-tiles": this.listStyle === "tiles",
      "entity-row__title--in-rows": this.listStyle === "rows"
    });
  }

  get subtitleClassNames() {
    return classNames({
      "entity-row__subtitle": true,
      "entity-row__subtitle--in-grid": this.listStyle === "grid",
      "entity-row__subtitle--in-tiles": this.listStyle === "tiles",
      "entity-row__subtitle--in-rows": this.listStyle === "rows"
    });
  }

  get countClassNames() {
    return classNames({
      "entity-row__count": true,
      "entity-row__count--in-grid": this.listStyle === "grid",
      "entity-row__count--in-tiles": this.listStyle === "tiles",
      "entity-row__count--in-rows": this.listStyle === "rows"
    });
  }

  get metaClassNames() {
    return classNames({
      "entity-row__meta": true,
      "entity-row__meta--in-grid": this.listStyle === "grid",
      "entity-row__meta--in-tiles": this.listStyle === "tiles",
      "entity-row__meta--in-rows": this.listStyle === "rows"
    });
  }

  get rowClickMode() {
    return this.props.rowClickMode;
  }

  get isSortable() {
    return this.props.isSortable;
  }

  wrapWithAnchor(child, url, block = false) {
    const className = classNames({
      "entity-row__row-link": true,
      "entity-row__row-link--block": block,
      "entity-row__row-link--atag": true,
      "entity-row__row-link--in-grid": this.listStyle === "grid",
      "entity-row__row-link--is-active": this.active
    });
    return (
      <Link
        className={className}
        to={url}
        aria-describedby={`${this.labelId}-describedby`}
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
      "entity-row__row-link--is-active": this.active
    });
    return (
      <button className={className} onClick={onClick}>
        {child}
      </button>
    );
  }

  wrapWithClickHandler(child, block = false) {
    if (!this.onRowClick) return child;
    if (isString(this.onRowClick))
      return this.wrapWithAnchor(child, this.onRowClick, block);
    return this.wrapWithButton(child, this.onRowClick, block);
  }

  inlineLink(child) {
    if (this.rowClickMode !== "inline") return child;
    return this.wrapWithClickHandler(child, false);
  }

  blockLink(child) {
    if (!this.entireRowIsClickable) return child;
    return this.wrapWithClickHandler(child, true);
  }

  render() {
    this.labelId = labelId();

    return (
      <li className="entity-row entity-list__entity">
        {this.blockLink(
          <div className={this.rowClassNames}>
            {this.figure && (
              <div className={this.figureClassNames}>
                {this.inlineLink(this.figure)}
              </div>
            )}
            <div className={this.textClassNames}>
              {this.title && (
                <h3 className={this.titleClassNames}>
                  <span className="entity-row__title-inner">
                    {this.inlineLink(this.title)}
                  </span>
                  {this.hasLabels && <LabelSet labels={this.labels} />}
                  <span
                    id={`${this.labelId}-describedby`}
                    className="aria-describedby"
                  >
                    {`View ${this.titlePlainText}`}
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
            {this.utility && (
              <div className="entity-row__utility">{this.utility}</div>
            )}
          </div>
        )}
      </li>
    );
  }
}
