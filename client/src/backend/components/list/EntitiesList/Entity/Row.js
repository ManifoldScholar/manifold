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
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid"])
  };

  static defaultProps = {
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
      "entity-list__entity": true,
      "entity-row": true,
      "entity-row--in-grid": this.listStyle === "grid",
      "entity-row--in-tiles": this.listStyle === "tiles",
      "entity-row--in-rows": this.listStyle === "rows"
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

  anchorLink(child, url) {
    return (
      <Link to={url} aria-describedby={`${this.labelId}-describedby`}>
        {child}
      </Link>
    );
  }

  callbackLink(child, onClick) {
    return <button onClick={onClick}>{child}</button>;
  }

  link(child) {
    const onRowClick = this.props.onRowClick;
    if (!onRowClick) return child;
    if (isString(onRowClick)) return this.anchorLink(child, onRowClick);
    return this.callbackLink(child, onRowClick);
  }

  render() {
    this.labelId = labelId();

    return (
      <li className={this.rowClassNames}>
        {this.figure && (
          <div className={this.figureClassNames}>{this.link(this.figure)}</div>
        )}
        <div className={this.textClassNames}>
          {this.title && (
            <h4 className={this.titleClassNames}>
              <span className="entity-row__title-inner">
                {this.link(this.title)}
              </span>
              {this.hasLabels && <LabelSet labels={this.labels} />}
              <span
                id={`${this.labelId}-describedby`}
                className="aria-describedby"
              >
                {`View ${this.titlePlainText}`}
              </span>
            </h4>
          )}
          {!this.title && this.hasLabels && <LabelSet labels={this.labels} />}
          {this.hasSubtitle && (
            <h5 className={this.subtitleClassNames}>{this.subtitle}</h5>
          )}
          {this.hasCount && (
            <h5 className={this.countClassNames}>{this.count}</h5>
          )}
          {this.hasMeta && <h6 className={this.metaClassNames}>{this.meta}</h6>}
        </div>
        {this.utility && <div className="entity-row__utility">Utility</div>}
      </li>
    );
  }
}
