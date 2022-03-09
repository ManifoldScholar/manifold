import React from "react";
import PropTypes from "prop-types";
import isFunction from "lodash/isFunction";
import {
  ProjectPlaceholder,
  ResourceCollectionPlaceholder,
  ResourcePlaceholder,
  TextPlaceholder,
  TextSectionPlaceholder
} from "./placeholders";
import {
  getResponse,
  idInResponses
} from "frontend/components/collecting/helpers";

const placeholderMap = {
  projects: ProjectPlaceholder,
  resourceCollections: ResourceCollectionPlaceholder,
  resources: ResourcePlaceholder,
  texts: TextPlaceholder,
  textSections: TextSectionPlaceholder,
  journalIssues: ProjectPlaceholder
};

function getPlaceholder(type) {
  return placeholderMap[type];
}

function DeferredCollectable({
  responses,
  type,
  id,
  children,
  ...passThroughProps
}) {
  const isLoaded = idInResponses(id, responses);
  const Placeholder = getPlaceholder(type);

  if (!isLoaded) return <Placeholder {...passThroughProps} />;

  const response = getResponse(id, responses);

  if (!isFunction(children)) return null;

  return children(response);
}

DeferredCollectable.displayName = "Collecting.DeferredCollectable";

DeferredCollectable.propTypes = {
  responses: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default DeferredCollectable;
