import React, { useState } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { JoinGroup } from "frontend/components/reading-group/tables/Groups/actions";
import { useCurrentUser } from "hooks";
import { Actions, Body, Title, Wrapper } from "../parts";

function GroupAnnotationsPlaceholder({ readingGroup }) {
  // since RG data isn't refreshed when a user joins,
  // we store join status in component state (set initially by RG data)
  const [userIsMember, setUserIsMember] = useState(
    readingGroup.attributes.currentUserRole !== "none"
  );

  const currentUser = useCurrentUser();
  const loggedIn = !isEmpty(currentUser);

  function getContent() {
    if (!loggedIn) {
      return {
        title: "This group doesn‘t have any annotations yet.",
        body:
          "Sign up or log in, then join this group and be the first member to create an annotation!",
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

    if (!userIsMember) {
      return {
        title: "This group doesn‘t have any annotations yet.",
        body:
          "Join and be the first member to create an annotation! While reading, you can associate a new or existing annotation with this group.",
        actions: [
          {
            children: (
              <JoinGroup
                readingGroup={readingGroup}
                onSuccess={() => setUserIsMember(true)}
                buttonText="Join this group"
              />
            )
          }
        ]
      };
    }

    return {
      title: "Be the first reader to annotate in this group!",
      body:
        "While reading, you can associate a new or existing annotation with this group.",
      actions: []
    };
  }

  const { title, body, actions } = getContent();

  return (
    <Wrapper context="frontend">
      <Title icon="readingGroup24">{title}</Title>
      <Body>
        <p>{body}</p>
      </Body>
      <Actions actions={actions} />
    </Wrapper>
  );
}

GroupAnnotationsPlaceholder.displayName =
  "Global.Composed.EntityCollectionPlaceholder.GroupAnnotations";

GroupAnnotationsPlaceholder.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default GroupAnnotationsPlaceholder;
