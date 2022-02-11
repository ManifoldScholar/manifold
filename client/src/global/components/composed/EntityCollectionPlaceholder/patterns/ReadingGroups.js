import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { useCurrentUser } from "hooks";
import { Actions, Body, Title, Wrapper } from "../parts";

function ReadingGroupsPlaceholder({ isPublic }) {
  const currentUser = useCurrentUser();

  function getContent() {
    if (!currentUser) {
      return {
        title: "This Manifold doesn’t have any reading groups yet.",
        body:
          "Sign up or log in to create the first group, or learn more about reading groups in our documentation.",
        actions: [
          {
            children: (
              <Link to={lh.link("frontendLogin")} className="button-tertiary">
                Log in
              </Link>
            )
          }
        ]
      };
    }

    if (isPublic)
      return {
        title: "This Manifold doesn’t have any reading groups yet.",
        body:
          "Be the first person to create one, or learn more about reading groups in our documentation.",
        actions: [
          {
            children: (
              <Link
                to={lh.link("frontendMyReadingGroupsNew")}
                className="button-tertiary"
              >
                Create New Group
              </Link>
            )
          }
        ]
      };

    return {
      title: "Join a group, or create a new one.",
      body:
        "To join a group, enter your group invitation code below. You can also create your own group, or learn more about reading groups in our documentation.",
      actions: [
        {
          children: (
            <Link
              to={lh.link("frontendMyReadingGroupsNew")}
              className="button-tertiary"
            >
              Create New Group
            </Link>
          )
        }
      ]
    };
  }

  const { title, body, actions } = getContent();

  return (
    <Wrapper>
      <Title icon="readingGroup24">{title}</Title>
      <Body>
        <p>{body}</p>
      </Body>
      <Actions actions={actions} />
    </Wrapper>
  );
}

ReadingGroupsPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.ReadingGroups";

ReadingGroupsPlaceholder.propTypes = {
  isPublic: PropTypes.bool
};

export default ReadingGroupsPlaceholder;
