import { useOutletContext, useNavigate, useRevalidator } from "react-router";
import { journalsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import Hero from "backend/components/hero";

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: () => journalsAPI.actionCallouts(params.id),
    options: { skipFilters: true, skipPagination: true }
  });
};

export default function JournalLayoutContainer({ loaderData }) {
  const actionCallouts = loaderData.data;
  const journal = useOutletContext();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const closeUrl = `/backend/journals/${journal?.id}/layout`;

  const onEditHero = () => {
    navigate(`/backend/journals/${journal?.id}/layout/hero`);
  };

  return (
    <>
      <Hero.Builder
        include={["journalDescription", "actionCallouts"]}
        onEditHero={onEditHero}
        actionCallouts={actionCallouts}
        refreshActionCallouts={revalidate}
        model={journal}
        modelLabel="journal"
        actionCalloutSlots={["right-button", "right-link"]}
        actionCalloutEditRoute={(modelId, calloutId) =>
          `/backend/journals/${modelId}/layout/action-callout/${calloutId}`
        }
        actionCalloutNewRoute={modelId =>
          `/backend/journals/${modelId}/layout/action-callout/new`
        }
      />
      <OutletWithDrawers
        drawerProps={{
          closeUrl,
          lockScroll: "always",
          wide: true
        }}
        context={journal}
      />
    </>
  );
}
