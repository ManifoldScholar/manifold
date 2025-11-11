import { useOutletContext, Outlet } from "react-router-dom";

export default function ProjectCategoryWrapperContainer() {
  const { project, refresh } = useOutletContext() || {};

  return <Outlet context={{ project, refresh }} />;
}

ProjectCategoryWrapperContainer.displayName = "Project.Category.Wrapper";
