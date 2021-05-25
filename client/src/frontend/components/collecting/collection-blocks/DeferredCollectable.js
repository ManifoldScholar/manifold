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
  textSections: TextSectionPlaceholder
};

function getPlaceholder(type) {
  return placeholderMap[type];
}

function DeferredCollectable({ responses, type, id, children }) {
  const isLoaded = idInResponses(id, responses);
  const Placeholder = getPlaceholder(type);

  if (!isLoaded) return <Placeholder />;

  const response = getResponse(id, responses);

  if (!isFunction(children)) return null;

  return children(response);
}

DeferredCollectable.displayName = "ReadingGroup.Collecting.DeferredCollectable";

DeferredCollectable.propTypes = {
  responses: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default DeferredCollectable;
