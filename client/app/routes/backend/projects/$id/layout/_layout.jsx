import { useOutletContext, useNavigate, useRevalidator } from "react-router";
import { projectsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import Hero from "backend/components/hero";
import ContentBlock from "backend/components/content-block";

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: () => projectsAPI.actionCallouts(params.id),
    options: { skipFilters: true, skipPagination: true }
  });
};

export default function ProjectLayoutContainer({ loaderData }) {
  const actionCallouts = loaderData?.data ?? [];
  const project = useOutletContext();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const closeUrl = `/backend/projects/${project?.id}/layout`;

  const onEditHero = () => {
    navigate(`/backend/projects/${project?.id}/layout/hero`);
  };

  return (
    <>
      <Hero.Builder
        include={["projectDescription", "actionCallouts"]}
        onEditHero={onEditHero}
        actionCallouts={actionCallouts}
        refreshActionCallouts={revalidate}
        model={project}
      />
      <ContentBlock.Builder project={project}>
        {(closeWithoutSave, onSave, pendingBlock) => (
          <OutletWithDrawer
            drawerProps={{
              closeUrl,
              lockScroll: "always",
              wide: true,
              closeCallback: closeWithoutSave
            }}
            context={{
              pendingBlock,
              project,
              calloutable: project,
              refreshActionCallouts: revalidate,
              closeUrl,
              closeCallback: onSave
            }}
          />
        )}
      </ContentBlock.Builder>
    </>
  );
}
