import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { JoinGroup } from "frontend/components/reading-group/tables/Groups/actions";
import { useCurrentUser } from "hooks";
import { Actions, Body, Title, Wrapper } from "../parts";

function GroupAnnotationsPlaceholder({ readingGroup, refresh, style }) {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const loggedIn = !isEmpty(currentUser);
  const userIsMember = readingGroup.attributes.currentUserRole === "none";

  function getContent() {
    if (!loggedIn) {
      return {
        title: t("placeholders.annotations_group.no_user.title"),
        body: t("placeholders.annotations_group.no_user.body"),
        actions: [
          {
            children: (
              <Link to={lh.link("frontendLogin")} className="button-tertiary">
                {t("navigation.user.log_in")}
              </Link>
            )
          }
        ]
      };
    }

    if (!userIsMember) {
      return {
        title: t("placeholders.annotations_group.user_not_member.title"),
        body: t("placeholders.annotations_group.user_not_member.body"),
        actions: [
          {
            children: (
              <JoinGroup
                readingGroup={readingGroup}
                onSuccess={refresh}
                buttonText={t("actions.join_group")}
              />
            )
          }
        ]
      };
    }

    return {
      title: t("placeholders.annotations_group.user_is_member.title"),
      body: t("placeholders.annotations_group.user_is_member.body"),
      actions: []
    };
  }

  const { title, body, actions } = getContent();

  return (
    <Wrapper context="frontend" style={style}>
      <Title icon="readingGroup24">{title}</Title>
      <Body>
        <p>{body}</p>
      </Body>
      <Actions actions={actions} />
    </Wrapper>
  );
}

GroupAnnotationsPlaceholder.displayName =
  "Global.Entity.CollectionPlaceholder.GroupAnnotations";

GroupAnnotationsPlaceholder.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default GroupAnnotationsPlaceholder;
