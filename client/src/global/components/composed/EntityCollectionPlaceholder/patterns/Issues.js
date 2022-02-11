import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

const HELP_LINK = "https://manifoldscholar.github.io/manifold-docusaurus/docs";

function IssuesPlaceholder({ bgColor = "neutral05" }) {
  return (
    <Wrapper bgColor={bgColor}>
      <Title icon="journals64">
        <Authorize entity="journalIssue" ability="create">
          Oh no. There are no journal issues in this Manifold library.
        </Authorize>
        <Authorize
          entity="journalIssue"
          ability="create"
          successBehavior="hide"
        >
          There are no journal issues in this Manifold library.
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="journalIssue" ability="create">
            <p>
              {
                "But it’s easy to create new issues with Manifold. If you have backend access, "
              }
              <Link to={lh.link("backend")}>head to the backend</Link>
              {" and first select "}
              <em>Add a New Journal</em>
              {
                ". Once you’ve created a journal, you can add new issues to it, or turn existing projects into journal issues. For more help, you can learn about creating and publishing Manifold Issues in "
              }
              <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
                our documentation
              </a>
              .
            </p>
          </Authorize>
          <Authorize
            entity="journalIssue"
            ability="create"
            successBehavior="hide"
          >
            <p>Please check back soon!</p>
          </Authorize>
        </>
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Authorize entity="journalIssue" ability="create">
                <Link
                  to={lh.link("backendJournalsNew")}
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

IssuesPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.Journals";

IssuesPlaceholder.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default IssuesPlaceholder;
