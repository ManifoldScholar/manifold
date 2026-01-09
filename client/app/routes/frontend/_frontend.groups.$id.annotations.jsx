import { useOutletContext, useNavigate, useParams } from "react-router";
import { readingGroupsAPI } from "api";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import loadList from "app/routes/utility/loaders/loadList";
import EntityCollection from "frontend/components/entity/Collection";
import { useListFilters, useListSearchParams } from "hooks";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import * as Styled from "frontend/containers/ReadingGroup/styles";

const DEFAULT_FILTERS = { formats: ["annotation"] };

export const loader = async ({ params, request, context }) => {
  const fetchFn = (filters, pagination) =>
    readingGroupsAPI.annotations(params.id, filters, pagination);

  return loadList({
    request,
    context,
    fetchFn,
    options: {
      defaultFilters: DEFAULT_FILTERS,
      arrayKeys: ["formats"]
    }
  });
};

export const clientLoader = ({ params, request, serverLoader }) => {
  const fetchFn = (filters, pagination) =>
    readingGroupsAPI.annotations(params.id, filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__readingGroupAnnotationsHydrated",
    fetchFn,
    options: {
      defaultFilters: DEFAULT_FILTERS,
      arrayKeys: ["formats"]
    }
  });

  return clientLoaderFn({ request, serverLoader });
};

export default function ReadingGroupAnnotationsRoute({ loaderData }) {
  const { data: annotations, meta } = loaderData;
  const readingGroup = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: DEFAULT_FILTERS,
    arrayKeys: ["formats"]
  });

  const { annotatedTexts: texts, readingGroupMemberships: memberships } =
    readingGroup?.relationships ?? {};

  const filterProps = useListFilters({
    onFilterChange: state => setFilters(state),
    initialState: filters,
    resetState: null,
    options: { sortChron: true, memberships, texts }
  });

  const closeUrl = `/groups/${id}/annotations`;
  const handleCloseDrawer = () => navigate(closeUrl);

  return (
    <Styled.Body>
      <OutletWithDrawer
        context={{
          readingGroup,
          closeDrawer: handleCloseDrawer
        }}
        drawerProps={{
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always",
          closeUrl
        }}
      />
      <EntityCollection.GroupAnnotations
        readingGroup={readingGroup}
        annotations={annotations}
        annotationsMeta={meta}
        filterProps={{ ...filterProps, hideSearch: true }}
        isFiltered={!!Object.keys(filters).length}
        nested
      />
    </Styled.Body>
  );
}
