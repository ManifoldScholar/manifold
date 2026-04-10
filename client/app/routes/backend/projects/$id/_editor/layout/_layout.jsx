import { useOutletContext, useNavigate, useRevalidator } from "react-router";
import { projectsAPI } from "api";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import Hero from "backend/components/hero";
import ContentBlock from "backend/components/content-block";

export const loader = async ({ params, context }) => {
  return loadParallelLists({
    context,
    fetchFns: {
      actionCallouts: () => projectsAPI.actionCallouts(params.id),
      contentBlocks: () => projectsAPI.contentBlocks(params.id)
    }
  });
};

export default function ProjectLayoutContainer({ loaderData }) {
  const { actionCallouts, contentBlocks } = loaderData;
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
      <ContentBlock.Builder project={project} contentBlocks={contentBlocks}>
        {(pendingBlock, clearPendingBlock) => (
          <OutletWithDrawers
            drawerProps={{
              closeUrl,
              lockScroll: "always",
              wide: true,
              closeCallback: clearPendingBlock
            }}
            context={{
              pendingBlock,
              project,
              clearPendingBlock
            }}
          />
        )}
      </ContentBlock.Builder>
    </>
  );
}
