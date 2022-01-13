import React from "react";
import PropTypes from "prop-types";
import { Actions, Body, Title, Wrapper } from "../parts";

function ProjectCollectionsBackendPlaceholder({ onClick }) {
  return (
    <Wrapper>
      <Title icon="booksOnShelfStrokeUnique">
        Ready to create a Project Collection?
      </Title>
      <Body>
        With Project Collections, you can take control of what appears on your
        Manifold Library homepage. Create custom groupings of Projects and
        change their order and visibility. You can handpick your collections and
        order them manually, or you can create Smart Collections that
        automatically update based on your filtering criteria.
      </Body>
      <Actions
        actions={[
          {
            title: "Create a collection",
            buttonProps: {
              onClick
            }
          }
        ]}
      />
    </Wrapper>
  );
}

ProjectCollectionsBackendPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.ProjectCollectionsBackend";

ProjectCollectionsBackendPlaceholder.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default ProjectCollectionsBackendPlaceholder;
