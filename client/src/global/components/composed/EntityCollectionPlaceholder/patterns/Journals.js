import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import Authorize from "hoc/authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

const HELP_LINK =
  "https://manifoldscholar.github.io/manifold-docusaurus/docs/backend/project_collections";

function JournalsPlaceholder({ bgColor = "neutral05" }) {
  return (
    <Wrapper bgColor={bgColor}>
      <Title>
        <Authorize entity="projectCollection" ability="create">
          Oh no. There are no journals in this Manifold library.
        </Authorize>
        <Authorize entity="project" ability="create" successBehavior="hide">
          There are no journals in this Manifold library.
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="project" ability="create">
            <p>
              {
                "But it’s easy to create new journals with Manifold. If you have backend access, "
              }
              <Link to={lh.link("backendProjectCollections")}>
                head to the backend
              </Link>
              {" and select "}
              <em>Add a New Journal</em>
              {
                ". For more help, you can learn about creating and publishing Manifold Journals "
              }
              <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
                here
              </a>
              .
            </p>
          </Authorize>
          <Authorize entity="project" ability="create" successBehavior="hide">
            <p>Please check back soon!</p>
          </Authorize>
          <Utility.IconComposer icon="BooksOnShelfColorUnique" size={205} />
        </>
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Authorize entity="project" ability="create">
                <Link
                  to={lh.link("backendProjectCollections")}
                  className="button-tertiary"
                >
                  Create a journal now
                </Link>
              </Authorize>
            )
          }
        ]}
      />
    </Wrapper>
  );
}

JournalsPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.Journals";

JournalsPlaceholder.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default JournalsPlaceholder;
