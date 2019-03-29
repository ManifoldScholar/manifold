import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Title from "./Title";
import Instructions from "./Instructions";
import Pagination from "./Pagination";
import Count from "./Count";
import ButtonSet from "./ButtonSet";
import Entities from "./Entities";
import SortableEntities from "./SortableEntities";
import isPlainObject from "lodash/isPlainObject";
import isFunction from "lodash/isFunction";
import isBoolean from "lodash/isBoolean";
import isNil from "lodash/isNil";
import labelId from "helpers/labelId";

export default class ListEntities extends PureComponent {
  static displayName = "List.Entities.List";

  static errors = {
    callbackInvalid:
      'List.Entities.List "callback" prop must be null or plain object.',
    missingOnPageClick:
      'Lists with pagination must have a "callback.onPageClick" function prop.',
    showCountNotBool:
      'List.Entities.List "showCount" and "showCountInTitle" props must be a boolean value.',
    showCountNoPagination:
      "Lists that show count must have a pagination object prop.",
    invalidButton:
      "List buttons prop can only include List.Entities.List.Button components.",
    invalidSearch:
      "List search prop can only include List.Entities.List.Search components."
  };

  static validateCallbacks = (props, propName) => {
    const callbacks = props[propName];
    const callbackInvalid = callbacks !== null && !isPlainObject(callbacks);
    if (callbackInvalid) return new Error(this.errors.callbackInvalid);
    const missingOnPageClick =
      props.pagination && !isFunction(callbacks.onPageClick);
    if (missingOnPageClick) return new Error(this.errors.missingOnPageClick);
  };

  static validateShowCounts = (props, propName) => {
    const value = props[propName];
    if (!isNil(value) && !isBoolean(value)) return;
    if (value && !props.pagination)
      return new Error(this.errors.showCountNoPagination);
  };

  static validateEnsureButton = (propValue, key) => {
    const value = propValue[key];
    if (!value) return;
    if (!value.type || value.type.displayName !== "List.Entities.List.Button") {
      return new Error(this.errors.invalidButton);
    }
  };

  static validateSearch = (propValue, key) => {
    const value = propValue[key];
    if (!value) return;
    if (!value.type || value.type.displayName !== "List.Entities.List.Search") {
      return new Error(this.errors.invalidSearch);
    }
  };

  static propTypes = {
    callbacks: ListEntities.validateCallbacks,
    entities: PropTypes.array,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    title: PropTypes.node,
    titleIcon: PropTypes.string,
    titleStyle: PropTypes.oneOf(["bar", "title", "section"]),
    titleLink: PropTypes.string,
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare"]),
    showCount: ListEntities.validateShowCounts,
    showCountInTitle: ListEntities.validateShowCounts,
    buttons: PropTypes.arrayOf(ListEntities.validateEnsureButton),
    search: ListEntities.validateSearch,
    pagination: PropTypes.object,
    useDragHandle: PropTypes.bool,
    paginationStyle: PropTypes.oneOf(["compact", "normal"]),
    unit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        singular: PropTypes.string,
        plural: PropTypes.string
      })
    ])
  };

  static defaultProps = {
    showCount: false,
    showCountInTitle: false,
    titleStyle: "title",
    listStyle: "rows",
    entityComponentProps: {},
    callbacks: {}
  };

  get titleIcon() {
    return this.props.titleIcon;
  }

  get title() {
    return this.props.title;
  }

  get titleLink() {
    return this.props.titleLink;
  }

  get entities() {
    return this.props.entities;
  }

  get instructions() {
    return this.props.instructions;
  }

  get entityComponent() {
    return this.props.entityComponent;
  }

  get pagination() {
    return this.props.pagination;
  }

  get paginationStyle() {
    return this.props.paginationStyle;
  }

  get unit() {
    return this.props.unit;
  }

  get buttons() {
    return this.props.buttons || [];
  }

  get hasButtons() {
    return this.buttons.length > 0;
  }

  get search() {
    return this.props.search;
  }

  get hasSearch() {
    return !isNil(this.search);
  }

  get entityComponentProps() {
    return Object.assign({}, this.props.entityComponentProps, {
      listStyle: this.listStyle
    });
  }

  get listStyle() {
    return this.props.listStyle;
  }

  get titleStyle() {
    return this.props.titleStyle;
  }

  get showCountInTitle() {
    return this.props.showCountInTitle;
  }

  get showCount() {
    return this.props.showCount;
  }

  get callbacks() {
    return this.props.callbacks;
  }

  get isSortable() {
    return isFunction(this.callbacks.onReorder);
  }

  callback(name) {
    if (!this.callbacks) return null;
    return this.callbacks[name];
  }

  render() {
    const listId = labelId("entities-list");

    const wrapperClassNames = classNames({
      "entity-list": true,
      "entity-list--bare": this.listStyle === "bare"
    });

    const listClassNames = classNames({
      "entity-list__list": true,
      "entity-list__list--bare": this.listStyle === "bare",
      "entity-list__list--grid": this.listStyle === "grid",
      "entity-list__list--tiles": this.listStyle === "tiles",
      "entity-list__list--rows": this.listStyle === "rows"
    });

    const contentsWrapperClassName = classNames({
      "entity-list__contents-wrapper": true,
      "entity-list__contents-wrapper--with-section-title":
        this.titleStyle === "section"
    });

    return (
      <div id={listId} className={wrapperClassNames}>
        {this.title && (
          <Title
            title={this.title}
            titleIcon={this.titleIcon}
            titleStyle={this.titleStyle}
            titleLink={this.titleLink}
            pagination={this.pagination}
            showCount={this.showCountInTitle}
          />
        )}
        <div className={contentsWrapperClassName}>
          {this.instructions && (
            <Instructions instructions={this.instructions} />
          )}
          {this.hasSearch && this.search}
          <div className="entity-list__header">
            {this.hasButtons && <ButtonSet buttons={this.buttons} />}
            {this.showCount && (
              <Count
                showCount={this.showCount}
                unit={this.unit}
                pagination={this.pagination}
              />
            )}
          </div>
          {!this.isSortable && (
            <Entities {...this.props} className={listClassNames} />
          )}
          {this.isSortable && (
            <SortableEntities {...this.props} className={listClassNames} />
          )}
          {this.pagination && (
            <Pagination
              pagination={this.pagination}
              paginationTarget={`#${listId}`}
              onPageClick={this.callback("onPageClick")}
              style={this.paginationStyle}
            />
          )}
        </div>
      </div>
    );
  }
}
