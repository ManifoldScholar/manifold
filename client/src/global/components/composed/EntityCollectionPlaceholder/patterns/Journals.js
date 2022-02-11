import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

const HELP_LINK = "https://manifoldscholar.github.io/manifold-docusaurus/docs";

function JournalsPlaceholder({ bgColor = "neutral05" }) {
  return (
    <Wrapper bgColor={bgColor}>
      <Title icon="journals64">
        <Authorize entity="journal" ability="create">
          Oh no. There are no journals in this Manifold library.
        </Authorize>
        <Authorize entity="journal" ability="create" successBehavior="hide">
          There are no journals in this Manifold library.
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="journal" ability="create">
            <p>
              {
                "But it’s easy to create new journals with Manifold. If you have backend access, "
              }
              <Link to={lh.link("backend")}>head to the backend</Link>
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
          <Authorize entity="journal" ability="create" successBehavior="hide">
            <p>Please check back soon!</p>
          </Authorize>
        </>
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Authorize entity="journal" ability="create">
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

JournalsPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.Journals";

JournalsPlaceholder.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default JournalsPlaceholder;
