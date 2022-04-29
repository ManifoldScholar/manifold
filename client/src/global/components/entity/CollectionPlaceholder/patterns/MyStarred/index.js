import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import Animation from "./Animation";
import { Actions, Body, Title, Wrapper } from "../../parts";

function MyStarredPlaceholder() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Title>{t("placeholders.my_starred.title")}</Title>
      <Body>
        <p>{t("placeholders.my_starred.body")}</p>
        <Animation />
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Link
                to={lh.link("frontendProjects")}
                className="button-tertiary"
              >
                {t("navigation.browse_projects")}
              </Link>
            )
          }
        ]}
      />
    </Wrapper>
  );
}

MyStarredPlaceholder.displayName =
  "Global.Entity.CollectionPlaceholder.MyStarred";

export default MyStarredPlaceholder;
