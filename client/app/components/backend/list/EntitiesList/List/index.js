import { useId } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ClientOnly from "global/components/utility/ClientOnly";
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
import * as Styled from "./styles";

const errors = {
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

function validateCallbacks(props, propName) {
  const callbacks = props[propName];
  if (callbacks === undefined || callbacks === null) return;
  if (!isPlainObject(callbacks)) return new Error(errors.callbackInvalid);
}

function validateShowCounts(props, propName) {
  const value = props[propName];
  if (!isNil(value) && !isBoolean(value)) return;
  if (value && !props.pagination)
    return new Error(errors.showCountNoPagination);
}

function validateEnsureButton(propValue, key) {
  const value = propValue[key];
  if (!value || typeof value) return;
  if (
    !value.type ||
    !(
      value.type.displayName === "List.Entities.List.Button" ||
      value.type.displayName === "List.Entities.List.BulkActionButtons"
    )
  ) {
    return new Error(errors.invalidButton);
  }
}

function validateSearch(propValue, key) {
  const value = propValue[key];
  if (!value) return;
  if (
    !value.type ||
    (value.type.displayName !== "List.Entities.List.Search" &&
      value.type.displayName !==
        "withI18nextTranslation(List.Entities.List.Search)")
  ) {
    return new Error(errors.invalidSearch);
  }
}

function ListEntities({
  callbacks = {},
  entities,
  entityComponent,
  entityComponentProps = {},
  title,
  instructions,
  preList,
  indented = false,
  titleIcon,
  titleStyle = "title",
  titleLink,
  titleTag,
  titleActions,
  listStyle = "rows",
  sortableStyle = "spaced",
  showCount = false,
  showCountInTitle = false,
  buttons,
  search,
  pagination,
  paginationPadding,
  paginationTarget,
  paginationStyle,
  useDragHandle,
  emptyMessage,
  unit,
  error,
  className,
  ...rest
}) {
  const id = useId();

  const buttonsList = Array.isArray(buttons) ? buttons : [];
  const isSortable = isFunction(callbacks.onReorder);
  const mergedEntityComponentProps = { ...entityComponentProps, listStyle };

  function callback(name) {
    if (!callbacks) return null;
    return callbacks[name];
  }

  const wrapperClassNames = classNames({
    "entity-list": true,
    "entity-list--bare": listStyle === "bare",
    "entity-list--well": listStyle === "well",
    "entity-list--indented": indented,
    [className]: className
  });

  const listClassNames = classNames({
    "entity-list__list": true,
    "entity-list__list--bare": listStyle === "bare",
    "entity-list__list--well": listStyle === "well",
    "entity-list__list--grid": listStyle === "grid",
    "entity-list__list--tiles": listStyle === "tiles",
    "entity-list__list--rows": listStyle === "rows",
    "entity-list__list--modal": listStyle === "modal",
    "entity-list__list--sortable": isSortable,
    "entity-list__list--sortable-tight": isSortable && sortableStyle === "tight"
  });

  const contentsWrapperClassName = classNames({
    "entity-list__contents-wrapper": true,
    "entity-list__contents-wrapper--with-section-title":
      titleStyle === "section"
  });

  const idPrefix = "entities-list";
  const idForInstructionsPrefix = "entities-list-instructions";

  const passProps = {
    callbacks,
    entities,
    entityComponent,
    entityComponentProps: mergedEntityComponentProps,
    listStyle,
    sortableStyle,
    useDragHandle,
    emptyMessage,
    ...rest
  };

  return (
    <div id={`${idPrefix}-${id}`} className={wrapperClassNames}>
      {title && (
        <Title
          title={title}
          titleIcon={titleIcon}
          titleStyle={titleStyle}
          titleLink={titleLink}
          pagination={pagination}
          showCount={showCountInTitle}
          titleTag={titleTag}
          titleActions={titleActions}
        />
      )}
      <div className={contentsWrapperClassName}>
        {instructions && (
          <Instructions
            instructions={instructions}
            id={`${idForInstructionsPrefix}-${id}`}
          />
        )}
        {preList}
        {!!search && search}
        {(!!buttonsList.length || showCount) && (
          <div className="entity-list__header">
            {!!buttonsList.length && <ButtonSet buttons={buttonsList} />}
            {showCount && (
              <Count
                showCount={showCount}
                unit={unit}
                pagination={pagination}
              />
            )}
          </div>
        )}
        {error && <Styled.Error>{error}</Styled.Error>}
        {!isSortable && (
          <Entities
            {...passProps}
            className={listClassNames}
            idForInstructions={`${idForInstructionsPrefix}-${id}`}
          />
        )}
        {isSortable && (
          <ClientOnly>
            <SortableEntities
              {...passProps}
              className={listClassNames}
              idForInstructions={`${idForInstructionsPrefix}-${id}`}
            />
          </ClientOnly>
        )}
        {pagination && (
          <Pagination
            pagination={pagination}
            paginationTarget={paginationTarget}
            padding={paginationPadding}
            onPageClick={callback("onPageClick")}
            style={paginationStyle}
          />
        )}
      </div>
    </div>
  );
}

ListEntities.displayName = "List.Entities.List";

ListEntities.propTypes = {
  callbacks: validateCallbacks,
  entities: PropTypes.array,
  entityComponent: PropTypes.func.isRequired,
  entityComponentProps: PropTypes.object,
  title: PropTypes.node,
  instructions: PropTypes.node,
  preList: PropTypes.node,
  indented: PropTypes.bool,
  titleIcon: PropTypes.string,
  titleStyle: PropTypes.oneOf(["bar", "title", "section"]),
  titleLink: PropTypes.string,
  titleTag: PropTypes.string,
  listStyle: PropTypes.oneOf([
    "rows",
    "tiles",
    "grid",
    "bare",
    "well",
    "modal"
  ]),
  sortableStyle: PropTypes.oneOf(["tight", "spaced"]),
  showCount: validateShowCounts,
  showCountInTitle: validateShowCounts,
  buttons: PropTypes.arrayOf(validateEnsureButton),
  search: validateSearch,
  pagination: PropTypes.object,
  paginationPadding: PropTypes.number,
  useDragHandle: PropTypes.bool,
  paginationStyle: PropTypes.oneOf(["compact", "normal"]),
  emptyMessage: PropTypes.node,
  unit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      singular: PropTypes.string,
      plural: PropTypes.string
    })
  ]),
  error: PropTypes.string
};

export default ListEntities;
