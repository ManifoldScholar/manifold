import { useState } from "react";
import { readingGroupsAPI } from "api";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { GroupHeading } from "frontend/components/reading-group/headings";
import SearchDialog from "frontend/components/collecting/SearchDialog";
import { Outlet } from "react-router-dom";
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

  const showSearchDialog = location.hash === "#search";

  const childProps = {
    refresh: () => setFetchVersion(prev => prev + 1),
    fetchVersion,
    readingGroup,
    closeDrawer: () => {
      const { pathname, search = "" } = location;
      const url = `${pathname}${search}`;
      navigate(url);
    },
    onArchive: () => {
      setFetchVersion(prev => prev + 1);
      const { pathname, search = "" } = location;
      const url = `${pathname}${search}`;
      navigate(url);
    }
  };

  const handleClose = () => {
    const { pathname, search = "" } = location;
    const url = `${pathname}${search}`;
    navigate(url);
  };

  const onCloseSearch = () => {
    setFetchVersion(prev => prev + 1);
    handleClose();
  };

  return (
    <>
      <Authorize entity={readingGroup} ability="read">
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
