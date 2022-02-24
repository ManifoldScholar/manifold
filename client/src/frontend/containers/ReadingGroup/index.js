import React, { useState } from "react";
import { readingGroupsAPI } from "api";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { childRoutes } from "helpers/router";
import { useDispatch } from "react-redux";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Drawer from "global/containers/drawer";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { GroupHeading } from "frontend/components/reading-group/headings";
import Settings from "frontend/components/reading-group/Settings";
import SearchDialog from "frontend/components/collecting/SearchDialog";
import { useFetch, useFromStore } from "hooks";

export default function ReadingGroup({ route }) {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const settings = useFromStore("settings", "select");

  const [fetchVersion, setFetchVersion] = useState(1);

  const { data: readingGroup } = useFetch({
    request: [readingGroupsAPI.show, id],
    dependencies: [fetchVersion]
  });

  if (!readingGroup) return null;

  const { name: groupName, currentUserRole } = readingGroup.attributes ?? {};

  const showSettingsDrawer = location.hash === "#settings";
  const showSearchDialog = location.hash === "#search";

  const childProps = {
    settings,
    refresh: () => setFetchVersion(prev => prev + 1),
    fetchVersion,
    history,
    route,
    readingGroup,
    dispatch
  };

  const settingsProps = {
    history,
    readingGroup,
    dispatch
  };

  const handleClose = () => {
    const { pathname, search = "" } = location;
    const url = `${pathname}${search}`;
    history.push(url);
  };

  const drawerProps = {
    open: showSettingsDrawer,
    context: "frontend",
    size: "wide",
    position: "overlay",
    lockScroll: "always",
    closeCallback: () => handleClose()
  };

  const onCloseSearch = () => {
    setFetchVersion(prev => prev + 1);
    handleClose();
  };

  const breadcrumbProps = () => {
    if (currentUserRole === "none")
      return {
        breadcrumbs: [
          {
            to: lh.link("frontendPublicReadingGroups"),
            label: "Public Reading Groups"
          }
        ]
      };
    return {
      breadcrumbs: [
        {
          to: lh.link("frontendMyReadingGroups"),
          label: "My Reading Groups"
        }
      ]
    };
  };

  return (
    <>
      <Drawer.Wrapper {...drawerProps}>
        <Settings {...settingsProps} />
      </Drawer.Wrapper>
      <HeadContent title={groupName} appendTitle />
      <section>
        <div className="container">
          <RegisterBreadcrumbs {...breadcrumbProps} />
          <GroupHeading
            readingGroup={readingGroup}
            history={history}
            location={location}
          />
          {childRoutes(route, { childProps })}
          {showSearchDialog && (
            <SearchDialog heading={groupName} onClose={onCloseSearch} />
          )}
        </div>
      </section>
    </>
  );
}
