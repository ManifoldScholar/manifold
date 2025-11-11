import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import Issue from "frontend/components/issue";
import Schema from "global/components/schema";

export default function IssueDetailContainer({ project, breadcrumbs }) {
  const parentJournal = project?.relationships?.journal;

  const headContentProps = useEntityHeadContent(project, parentJournal);

  if (!project) return null;

  return (
    <>
      <CheckFrontendMode debugLabel="IssueDetail" isProjectHomePage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <HeadContent {...headContentProps} />
      <Issue.Detail issue={project} />
      <Schema.Issue issue={project} />
    </>
  );
}
