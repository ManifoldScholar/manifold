import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

const HELP_LINK =
  "https://manifoldscholar.github.io/manifold-docusaurus/docs/backend/projects";

function ProjectsPlaceholder({
  bgColor = "neutral05",
  style = {
    paddingTop: 50,
    paddingBottom: 50
  }
}) {
  return (
    <Wrapper bgColor={bgColor} style={style}>
      <Title>
        <Authorize entity="projectCollection" ability="create">
          Uh-oh. This Manifold library is empty.
        </Authorize>
        <Authorize entity="project" ability="create" successBehavior="hide">
          This Manifold library is empty.
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="project" ability="create">
            <p>
              {
                "But it’s easy to create and publish projects with Manifold. If you have backend access, "
              }
              <Link to={lh.link("backend")}>head to the backend</Link>
              {" and select "}
              <em>Add a New Project</em>
              {
                ". For more help, you can learn about creating and publishing Manifold Projects "
              }
              <a href={HELP_LINK}>here</a>.
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
                  to={lh.link("backendProjectsNew")}
                  className="button-tertiary"
                >
                  Publish a Project Now
                </Link>
              </Authorize>
            )
          }
        ]}
      />
    </Wrapper>
  );
}

ProjectsPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.Projects";

ProjectsPlaceholder.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default ProjectsPlaceholder;
