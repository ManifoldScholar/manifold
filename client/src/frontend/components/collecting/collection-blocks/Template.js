import React from "react";
import PropTypes from "prop-types";
import EntityCollection from "frontend/components/entity/Collection/EntityCollection";
import DeferredCollectable from "frontend/components/collecting/collection-blocks/DeferredCollectable";

function getTitleForType(type) {
  switch (type) {
    case "projects":
      return "Projects";
    case "resourceCollections":
      return "Resource Collections";
    case "resources":
      return "Resources";
    case "texts":
      return "Texts";
    case "textSections":
      return "Text Sections";
    case "journalIssues":
      return "Journal Issues";
    default:
      return null;
  }
}

function getIconForType(type) {
  switch (type) {
    case "projects":
      return "projects64";
    case "resourceCollections":
      return "resourceCollection64";
    case "resources":
      return "resources64";
    case "texts":
      return "textsStacked64";
    case "textSections":
      return "toc64";
    case "journalIssues":
      return "journals64";
    default:
      return null;
  }
}

function CollectionBlockTemplate({
  type,
  collectedIds,
  responses,
  ListComponent,
  ResponseComponent,
  ...passThroughProps
}) {
  if (!collectedIds?.length) return null;

  const title = getTitleForType(type);
  const icon = getIconForType(type);

  return (
    <EntityCollection
      title={title}
      icon={icon}
      BodyComponent={() => (
        <ListComponent>
          {props =>
            collectedIds.map(id => (
              <li key={id}>
                <DeferredCollectable
                  id={id}
                  type={type}
                  responses={responses}
                  {...props}
                >
                  {response => (
                    <ResponseComponent response={response} {...props} />
                  )}
                </DeferredCollectable>
              </li>
            ))
          }
        </ListComponent>
      )}
      {...passThroughProps}
    />
  );
}

CollectionBlockTemplate.displayName = "Collecting.CollectionBlock.Template";

CollectionBlockTemplate.propTypes = {
  type: PropTypes.string.isRequired,
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  ListComponent: PropTypes.func.isRequired,
  ResponseComponent: PropTypes.func.isRequired,
  nested: PropTypes.bool
};

export default CollectionBlockTemplate;
