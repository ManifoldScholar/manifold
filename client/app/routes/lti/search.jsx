import { useEffect, useState } from "react";
import { parseQueryFromUrl } from "hooks/useSearch/helpers";
import useSearch from "hooks/useSearch";
import searchLoader from "app/routes/utility/loaders/search";
import Button from "components/global/atomic/Button";
import FacetCheckboxes from "components/lti/FacetCheckboxes";
import LtiRow from "components/lti/Row";
import LtiPager from "components/lti/Pager";
import * as Styled from "./styles";
import { useSelection } from "./selectionContext";

const ALLOWED_FACETS = ["Project", "Text", "TextSection", "Resource"];

const FACET_OPTIONS = [
  { label: "Projects", value: "Project" },
  { label: "Texts", value: "Text" },
  { label: "Sections", value: "TextSection" },
  { label: "Resources", value: "Resource" }
];

const TYPE_LABELS = {
  project: "Project",
  text: "Text",
  textSection: "Section",
  resource: "Resource"
};

export const handle = {
  breadcrumb: () => ({ label: "Search", to: "/lti/search" })
};

export const loader = async ({ request, context }) => {
  const url = new URL(request.url);
  const { facets: urlFacets = [] } = parseQueryFromUrl(url.search);
  const requested = urlFacets.filter(f => ALLOWED_FACETS.includes(f));
  return searchLoader({
    request,
    context,
    params: {
      facets: requested.length ? requested : ALLOWED_FACETS
    }
  });
};

const ROW_TYPES = ["project", "text", "textSection", "resource"];

function SearchResultRow({ result }) {
  const { add, remove, has } = useSelection();
  const type = result.attributes?.searchableType;
  const entity = result.relationships?.model;
  if (!entity || !ROW_TYPES.includes(type)) {
    return null;
  }

  const resultAttrs = result.attributes ?? {};
  const parentText = resultAttrs.parents?.text;
  const parentProject = resultAttrs.parents?.project;

  let to = null;
  let parent = null;
  const baseTitle =
    entity.attributes?.titlePlaintext ??
    resultAttrs.title ??
    entity.attributes?.name;
  let title = baseTitle;
  let selectionTitle = baseTitle;

  if (type === "project") {
    to = `/lti/projects/${entity.id}`;
  } else if (type === "text") {
    to = `/lti/texts/${entity.id}`;
  } else if (type === "textSection") {
    title = resultAttrs.title ?? entity.attributes?.name ?? baseTitle;
    const parentSlug = parentText?.slug;
    if (parentSlug) {
      to = `/lti/texts/${parentSlug}`;
      parent = { label: parentText.title, to };
    }
    selectionTitle = parentText?.title
      ? `${parentText.title} — ${title}`
      : title;
  } else if (type === "resource") {
    to = `/lti/resources/${entity.id}`;
    if (parentProject?.id) {
      parent = {
        label: parentProject.title,
        to: `/lti/projects/${parentProject.id}`
      };
    }
  }

  const selectionType = type === "textSection" ? "section" : type;
  const item = { type: selectionType, id: entity.id, title: selectionTitle };
  const selected = has(item);

  return (
    <LtiRow
      entity={entity}
      kind={type}
      to={to}
      parent={parent}
      title={title}
      typeLabel={TYPE_LABELS[type]}
      selected={selected}
      onToggle={() => (selected ? remove(item) : add(item))}
    />
  );
}

export default function LtiSearch({ loaderData }) {
  const { results, meta } = loaderData ?? {};
  const { searchQueryState, setQueryState, setPage } = useSearch();
  const keyword = searchQueryState.keyword ?? "";
  const [draft, setDraft] = useState(keyword);

  useEffect(() => {
    setDraft(keyword);
  }, [keyword]);

  const urlFacets = (searchQueryState.facets ?? []).filter(f =>
    ALLOWED_FACETS.includes(f)
  );

  const setFacets = nextFacets => {
    setQueryState({
      ...searchQueryState,
      facets: nextFacets,
      page: 1
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    setQueryState({
      ...searchQueryState,
      keyword: draft,
      page: 1
    });
  };

  const totalCount = meta?.pagination?.totalCount;

  return (
    <>
      <h1>
        {keyword ? (
          <>
            Search results for <em>{keyword}</em>
          </>
        ) : (
          "Search"
        )}
      </h1>

      <Styled.SearchForm onSubmit={onSubmit} role="search">
        <Styled.SearchInput
          type="search"
          name="keyword"
          placeholder="Search projects, texts, sections, and resources…"
          aria-label="Search"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          autoFocus={!keyword}
        />
        <Button
          type="submit"
          size="md"
          background="accent"
          label="Search"
          preIcon="search16"
        />
      </Styled.SearchForm>

      <FacetCheckboxes
        label="Filter by type"
        checkboxes={FACET_OPTIONS}
        value={urlFacets}
        onChange={setFacets}
      />

      {results === null || !keyword ? (
        <Styled.Empty>
          Enter a keyword in the search box above to find projects and texts.
        </Styled.Empty>
      ) : results.length === 0 ? (
        <Styled.Empty>No results for &ldquo;{keyword}&rdquo;.</Styled.Empty>
      ) : (
        <>
          {typeof totalCount === "number" ? (
            <Styled.ResultsCount>
              {totalCount} result{totalCount === 1 ? "" : "s"}
            </Styled.ResultsCount>
          ) : null}
          <Styled.List>
            {results.map(result => (
              <SearchResultRow key={result.id} result={result} />
            ))}
          </Styled.List>
          <Styled.PagerWrap>
            <LtiPager meta={meta} paginationClickHandler={setPage} />
          </Styled.PagerWrap>
        </>
      )}
    </>
  );
}
