import PropTypes from "prop-types";
import Template from "../../Template";
import Cover from "frontend/components/resource-collection/Cover";
import lh from "helpers/linkHandler";
import * as Styled from "frontend/components/resource-collection-list/Grid/styles";

function CollectedResourceCollections(props) {
  return (
    <Template
      {...props}
      type="resourceCollections"
      ListComponent={({ children, ...restProps }) => (
        <Styled.Grid>{children(restProps)}</Styled.Grid>
      )}
      ResponseComponent={({ response }) => (
        <Cover
          urlCreator={collection => {
            return lh.link(
              "frontendProjectResourceCollection",
              collection.attributes.projectSlug,
              collection.attributes.slug
            );
          }}
          resourceCollection={response}
        />
      )}
    />
  );
}

CollectedResourceCollections.displayName =
  "Collecting.CollectedResourceCollections";

CollectedResourceCollections.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  nested: PropTypes.bool
};

export default CollectedResourceCollections;
