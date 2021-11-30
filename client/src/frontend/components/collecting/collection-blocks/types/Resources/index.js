import React from "react";
import PropTypes from "prop-types";
import Template from "../../Template";
import Resourceish from "frontend/components/resourceish";
import lh from "helpers/linkHandler";
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
          to={lh.link(
            "frontendProjectResource",
            response.attributes.projectSlug,
            response.attributes.slug
          )}
        >
          <Resourceish.Thumbnail resourceish={response} showTitle />
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
