import React from "react";
import { useTranslation } from "react-i18next";
import Empty from "./Empty";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { useSearchQueryContext } from "../query/Context";
import { useSearchResults } from "hooks/search/useSearchResults";
import Types from "./Types";
import * as Styled from "./styles";

const TYPE_COMPONENT_MAP = {
  project: Types.Project,
  textSection: Types.TextSection,
  annotation: Types.Annotation,
  resource: Types.Resource,
  text: Types.Text,
  journal: Types.Journal,
  journalIssue: Types.Issue,
  journalVolume: Types.Volume
};

export default function SearchResultsList(props) {
  const { context = "frontend", hideParent = false, padding = 3 } = props;

  const { t } = useTranslation();
  const { facets, keyword, setPage } = useSearchQueryContext(
    "SearchResults.List"
  );
  const { results, resultsMeta } = useSearchResults();
  const pagination = resultsMeta?.pagination;

  if (!keyword?.value?.trim())
    return <Empty messageKey="search.no_search_term" />;
  if (facets.cleared) return <Empty messageKey="search.no_facets_selected" />;
  if (!results) return null;
  if (!results.length) return <Empty />;

  return (
    <Styled.Wrapper>
      <span>
        <Utility.EntityCount
          pagination={pagination}
          unit={t("glossary.result", { count: pagination.totalCount })}
        />
      </span>
      <Styled.List>
        {results.map(result => {
          const { searchableType } = result.attributes;
          const Component = TYPE_COMPONENT_MAP[searchableType];
          return Component ? (
            <Component
              hideParent={hideParent}
              key={result.id}
              result={result}
              context={context}
            />
          ) : null;
        })}
      </Styled.List>
      <Utility.Pagination
        pagination={pagination}
        padding={padding}
        paginationClickHandler={setPage}
      />
    </Styled.Wrapper>
  );
}

SearchResultsList.displayName = "Search.Results.List";

SearchResultsList.propTypes = {
  context: PropTypes.string,
  hideParent: PropTypes.bool,
  padding: PropTypes.number
};
