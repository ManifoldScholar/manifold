import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Authorize from "hoc/authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

function ResourceCollectionsPlaceholder({ id }) {
  return (
    <Wrapper bgColor="neutral05">
      <Title icon="resourceCollection64">
        <Authorize entity="projectCollection" ability="create">
          Uh-oh. This project doesn’t have any collections yet.
        </Authorize>
        <Authorize entity="project" ability="create" successBehavior="hide">
          This project doesn’t have any collections yet.
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="project" ability="create">
            <p>
              Resource collections are groupings of resources that can be used
              to orient a reader around certain themes or as a means to place a
              series of resources onto a text with one insertion.
            </p>
          </Authorize>
          <Authorize entity="project" ability="create" successBehavior="hide">
            <p>Please check back soon!</p>
          </Authorize>
        </>
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Authorize entity="project" ability="create">
                <Link
                  to={lh.link("backendProjectResourceCollectionsNew", id)}
                  className="button-tertiary"
                >
                  Create a Collection
                </Link>
              </Authorize>
            )
          }
        ]}
      />
    </Wrapper>
  );
}

ResourceCollectionsPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.ResourceCollections";

ResourceCollectionsPlaceholder.propTypes = {
  id: PropTypes.string.isRequired
};

export default ResourceCollectionsPlaceholder;
