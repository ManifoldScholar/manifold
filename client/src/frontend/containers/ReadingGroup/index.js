import { useState } from "react";
import { readingGroupsAPI } from "api";
import { useParams, Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Drawer from "global/containers/drawer";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { GroupHeading } from "frontend/components/reading-group/headings";
import Settings from "frontend/components/reading-group/Settings";
import SearchDialog from "frontend/components/collecting/SearchDialog";
import { useFetch } from "hooks";
import Authorize from "hoc/Authorize";

export default function ReadingGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [fetchVersion, setFetchVersion] = useState(1);

  const { data: readingGroup } = useFetch({
    request: [readingGroupsAPI.show, id],
    dependencies: [fetchVersion]
  });

  const breadcrumbProps =
    readingGroup?.attributes?.currentUserRole === "none"
      ? {
          breadcrumbs: [
            {
              to: lh.link("frontendPublicReadingGroups"),
              label: t("pages.public_groups")
            }
          ]
        }
      : {
          breadcrumbs: [
            {
              to: lh.link("frontendMyReadingGroups"),
              label: t("pages.my_groups")
            }
          ]
        };

  if (!readingGroup) return null;

  const { name: groupName } = readingGroup.attributes ?? {};

  const showSettingsDrawer = location.hash === "#settings";
  const showSearchDialog = location.hash === "#search";

  const childProps = {
    refresh: () => setFetchVersion(prev => prev + 1),
    fetchVersion,
    readingGroup
  };

  const handleClose = () => {
    const { pathname, search = "" } = location;
    const url = `${pathname}${search}`;
    navigate(url);
  };

  const settingsProps = {
    readingGroup,
    closeDrawer: handleClose,
    onArchive: () => {
      setFetchVersion(prev => prev + 1);
      handleClose();
    }
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

  return (
    <>
      <Authorize entity={readingGroup} ability="read">
        <Drawer.Wrapper {...drawerProps}>
          <Settings {...settingsProps} />
        </Drawer.Wrapper>
        <HeadContent title={groupName} appendDefaultTitle />
        <section>
          <div className="container">
            <RegisterBreadcrumbs {...breadcrumbProps} />
            <GroupHeading
              readingGroup={readingGroup}
              location={location}
              refresh={childProps.refresh}
            />
            <Outlet context={childProps} />
            {showSearchDialog && (
              <SearchDialog heading={groupName} onClose={onCloseSearch} />
            )}
          </div>
        </section>
      </Authorize>
    </>
  );
}
