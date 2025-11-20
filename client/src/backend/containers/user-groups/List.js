import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, { Button } from "backend/components/list/EntitiesList";

function UserGroupsListContainer({ route: baseRoute }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const id = pathname.split("/")[4];

  const drawerProps = {
    closeUrl: lh.link("backendRecordsUserGroups"),
    lockScroll: "always"
  };

  const renderChildRoutes = () => {
    const { routes, ...route } = baseRoute;
    const drawerRoutes = {
      ...route,
      routes: [routes.find(r => r.name === "backendRecordsUserGroupsNew")]
    };
    const detailRoutes = {
      ...route,
      routes: [routes.find(r => r.name === "backendRecordsUserGroup")]
    };
    return (
      <>
        {childRoutes(drawerRoutes, {
          drawer: true,
          drawerProps
        })}
        {childRoutes(detailRoutes)}
      </>
    );
  };

  const showList = !id || id === "new";

  return (
    <>
      {renderChildRoutes()}
      {showList && (
        <EntitiesList
          title={t("records.user_groups.header")}
          titleStyle="bar"
          entities={[]}
          buttons={[
            <Button
              path={lh.link("backendRecordsUserGroupsNew")}
              text={t("records.user_groups.button_label")}
              type="add"
              // authorizedFor="userGroup"
            />
          ]}
        />
      )}
    </>
  );
}

UserGroupsListContainer.displayName = "UserGroups.List";

UserGroupsListContainer.propTypes = {
  route: PropTypes.object
};

export default UserGroupsListContainer;
