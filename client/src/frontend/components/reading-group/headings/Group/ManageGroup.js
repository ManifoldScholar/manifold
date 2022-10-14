import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import ActionBox from "frontend/components/reading-group/ActionBox";
import * as Styled from "./styles";

function HeadingManageGroup({ readingGroup, history, location }) {
  const { t } = useTranslation();

  const homepageStaticPath = lh.link(
    "frontendReadingGroupHomepageStatic",
    readingGroup.id
  );
  const homepageEditPath = lh.link(
    "frontendReadingGroupHomepageEdit",
    readingGroup.id
  );
  const inEditMode = location.pathname === homepageEditPath;

  function handleSwitchChange() {
    if (!inEditMode) return history.push(homepageEditPath);
    history.push(homepageStaticPath);
  }

  return (
    <ActionBox
      title={t("forms.manage_group.title")}
      instructions={t("forms.manage_group.instructions")}
      actions={
        <Styled.ManageGroupContainer>
          <div aria-hidden>
            <Styled.EditToggle
              label={t("forms.manage_group.edit_homepage")}
              labelPos="inline"
              set={handleSwitchChange}
              value={inEditMode}
            />
          </div>
          <Link
            to={homepageStaticPath}
            className="screen-reader-text"
            tabIndex={-1}
          >
            {t("forms.manage_group.view_homepage")}
          </Link>
          <Link
            to={homepageEditPath}
            className="screen-reader-text"
            tabIndex={-1}
          >
            {t("forms.manage_group.edit_homepage_sr")}
          </Link>
          <a
            href="#settings"
            className="button-tertiary button-tertiary--neutral"
          >
            {t("forms.manage_group.edit_settings")}
          </a>
        </Styled.ManageGroupContainer>
      }
    />
  );
}

HeadingManageGroup.displayName = "ReadingGroup.Heading.ManageGroup";

HeadingManageGroup.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default HeadingManageGroup;
