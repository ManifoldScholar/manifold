import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { useCurrentUser } from "hooks";
import { Actions, Body, Title, Wrapper } from "../parts";

function ReadingGroupsPlaceholder({ isPublic }) {
  const currentUser = useCurrentUser();
  const { t } = useTranslation();

  function getContent() {
    if (!currentUser) {
      return {
        title: t("placeholders.reading_groups.no_user.title"),
        body: t("placeholders.reading_groups.no_user.body"),
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

    if (isPublic)
      return {
        title: t("placeholders.reading_groups.public.title"),
        body: t("placeholders.reading_groups.public.body"),
        actions: [
          {
            children: (
              <Link
                to={lh.link("frontendMyReadingGroupsNew")}
                className="button-tertiary"
              >
                {t("navigation.reading_group.create")}
              </Link>
            )
          }
        ]
      };

    return {
      title: t("placeholders.reading_groups.user.title"),
      body: t("placeholders.reading_groups.user.body"),
      actions: [
        {
          children: (
            <Link
              to={lh.link("frontendMyReadingGroupsNew")}
              className="button-tertiary"
            >
              {t("navigation.reading_group.create")}
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
  "Global.Entity.CollectionPlaceholder.ReadingGroups";

ReadingGroupsPlaceholder.propTypes = {
  isPublic: PropTypes.bool
};

export default ReadingGroupsPlaceholder;
