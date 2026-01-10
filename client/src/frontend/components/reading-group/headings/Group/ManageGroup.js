import PropTypes from "prop-types";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import ActionBox from "frontend/components/reading-group/ActionBox";
import Switch from "global/components/form/Switch";
import * as Styled from "./styles";
import { useNavigate } from "react-router";

function HeadingManageGroup({ readingGroup, location }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const currentLocation = useLocation();

  const settingsPath = `${currentLocation.pathname}/settings`;

  const homepageStaticPath = `/groups/${readingGroup.id}`;
  const homepageEditPath = `/groups/${readingGroup.id}/edit`;
  const inEditMode = location.pathname === homepageEditPath;

  function handleSwitchChange() {
    if (!inEditMode) {
      navigate(homepageEditPath);
    } else {
      revalidate();
      navigate(homepageStaticPath);
    }
  }

  return (
    <ActionBox
      title={t("forms.manage_group.title")}
      instructions={t("forms.manage_group.instructions")}
      actions={
        <Styled.ManageGroupContainer>
          <div aria-hidden>
            <Switch
              label={t("forms.manage_group.edit_homepage")}
              labelPos="inline"
              value={inEditMode}
              onChange={handleSwitchChange}
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
          <Link
            to={settingsPath}
            className="button-tertiary button-tertiary--neutral"
          >
            {t("forms.manage_group.edit_settings")}
          </Link>
        </Styled.ManageGroupContainer>
      }
    />
  );
}

HeadingManageGroup.displayName = "ReadingGroup.Heading.ManageGroup";

HeadingManageGroup.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default HeadingManageGroup;
