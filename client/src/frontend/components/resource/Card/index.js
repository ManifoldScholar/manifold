import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import Info from "./Info";
import Preview from "./Preview";
import * as Styled from "./styles";

function ResourceCard({
  resource,
  resourceCollection,
  project,
  itemHeadingLevel = 4
}) {
  if (!resource) return null;

  function getDetailUrl() {
    if (resourceCollection) {
      return lh.link(
        "frontendProjectCollectionResource",
        project.attributes.slug,
        resourceCollection.attributes.slug,
        resource.attributes.slug
      );
    }
    return lh.link(
      "frontendProjectResource",
      project.attributes.slug,
      resource.attributes.slug
    );
  }

  return (
    <Styled.Card>
      <Styled.Preview>
        <Preview resource={resource} detailUrl={getDetailUrl()} />
      </Styled.Preview>
      <Info
        resource={resource}
        detailUrl={getDetailUrl()}
        itemHeadingLevel={itemHeadingLevel}
      />
    </Styled.Card>
  );
}

ResourceCard.propTypes = {
  resource: PropTypes.object,
  project: PropTypes.object.isRequired,
  resourceCollection: PropTypes.object,
  itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
};

export default ResourceCard;
