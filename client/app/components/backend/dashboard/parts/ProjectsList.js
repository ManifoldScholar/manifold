import { useState, useMemo, useCallback } from "react";
import EntitiesList, {
  Button,
  Search,
  ProjectRow
} from "components/backend/list/EntitiesList";
import { useFetch, usePaginationState, useAuthentication } from "hooks";
import { projectsAPI } from "api";
import Authorization from "helpers/authorization";
import pickBy from "lodash/pickBy";
import identity from "lodash/identity";
import isEqual from "lodash/isEqual";
import { useTranslation } from "react-i18next";

const FILTER_PARAMS = [
  {
    label: "Search…",
    name: "keyword",
    value: ""
  },
  {
    label: "Draft",
    name: "draft",
    value: "",
    options: [
      { label: "All projects", value: "" },
      { label: "Only draft projects", value: "true" },
      { label: "Only published projects", value: "false" }
    ]
  },
  {
    label: "Creator",
    name: "with_creator_role",
    value: "",
    options: [
      { label: "Created by anyone", value: "" },
      { label: "Created by me", value: "true" }
    ]
  },
  {
    label: "Order",
    name: "order",
    value: "updated_at DESC",
    options: [
      { label: "Most recently updated", value: "updated_at ASC" },
      { label: "Alphabetical by title", value: "sort_title ASC" },
      { label: "Newest projects first", value: "created_at DESC" },
      { label: "Oldest projects first", value: "created_at ASC" },
      { label: "Most recently published", value: "publication_date DESC" }
    ]
  }
];

function buildInitialValues(params) {
  const values = {};
  params.forEach(p => {
    values[p.name] = p.value || "";
  });
  return values;
}

const INITIAL_VALUES = buildInitialValues(FILTER_PARAMS);

export default function ProjectsList() {
  const [pagination, setPageNumber] = usePaginationState(1, 5);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [message, setMessage] = useState(null);
  const authentication = useAuthentication();
  const { t } = useTranslation();

  const setParam = useCallback((paramLike, value) => {
    const name = typeof paramLike === "object" ? paramLike.name : paramLike;
    const param = FILTER_PARAMS.find(p => p.name === name);
    const key = param?.as || param?.name || name;
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const onReset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setMessage("Search and filters reset.");
    setTimeout(() => setMessage(null), 1000);
  }, []);

  const searchParams = useMemo(() => pickBy(values, identity), [values]);

  const filtersWithDefaults = useMemo(
    () => ({
      withUpdateAbility: true,
      ...searchParams
    }),
    [searchParams]
  );

  const { data: projects, meta: projectsMeta } = useFetch({
    request: [projectsAPI.index, filtersWithDefaults, pagination]
  });

  const authorization = new Authorization();
  const canCreateProjects = authorization.authorizeAbility({
    authentication,
    entity: "project",
    ability: "create"
  });

  const initialSearchParams = useMemo(
    () => pickBy(INITIAL_VALUES, identity),
    []
  );

  const noProjects =
    isEqual(searchParams, initialSearchParams) && canCreateProjects
      ? t("dashboard.empty_message_creator")
      : t("dashboard.empty_message_generic");

  if (!projects) return null;

  return (
    <div className="dashboard-panel">
      <div
        role="status"
        aria-live="polite"
        aria-atomic
        className="screen-reader-text"
      >
        {message}
      </div>
      <div className="panel">
        <EntitiesList
          entities={projects}
          entityComponent={ProjectRow}
          entityComponentProps={{
            placeholderMode: "small"
          }}
          title={t("glossary.project_title_case", {
            count: projectsMeta?.pagination?.totalCount
          })}
          titleLink="/backend/projects"
          titleIcon="BEProject64"
          titleStyle="bar"
          titleTag="h2"
          showCount
          showCountInTitle
          unit={t("glossary.project", {
            count: projectsMeta?.pagination?.totalCount
          })}
          pagination={projectsMeta.pagination}
          paginationPadding={1}
          callbacks={{
            onPageClick: page => () => setPageNumber(page)
          }}
          emptyMessage={noProjects}
          search={
            <Search
              searchStyle="vertical"
              onFilterChange={() => setPageNumber(1)}
              onReset={onReset}
              setParam={setParam}
              params={FILTER_PARAMS}
              values={values}
            />
          }
          buttons={[
            <Button
              path="/backend/projects/new"
              text={t("projects.add_button_label")}
              authorizedFor="project"
              authorizedTo="create"
              type="add"
            />
          ]}
        />
      </div>
    </div>
  );
}
