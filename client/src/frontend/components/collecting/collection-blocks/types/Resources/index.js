import React from "react";
import PropTypes from "prop-types";
import Template from "../../Template";
import Resource from "frontend/components/resource";
import * as Styled from "frontend/components/resource-list/Thumbnails/styles";

function CollectedResources(props) {
  return (
    <Template
      {...props}
      type="resources"
      ListComponent={({ children, ...restProps }) => (
        <Styled.Grid>{children(restProps)}</Styled.Grid>
      )}
      ResponseComponent={({ response }) => (
        <Styled.Link
          to={`/projects/${response.attributes.projectSlug}/resources/${response.attributes.slug}`}
        >
          <Resource.Thumbnail resource={response} showTitle />
        </Styled.Link>
      )}
    />
  );
}

CollectedResources.displayName = "Collecting.CollectedResources";

CollectedResources.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  nested: PropTypes.bool
};

export default CollectedResources;
