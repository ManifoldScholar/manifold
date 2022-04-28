import React from "react";
import { useTranslation } from "react-i18next";
import Empty from "./Empty";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
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
  const {
    results,
    pagination,
    paginationClickHandler,
    context = "frontend",
    hideParent = false,
    padding = 3
  } = props;

  const { t } = useTranslation();

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
        paginationClickHandler={paginationClickHandler}
        paginationTarget="#search"
      />
    </Styled.Wrapper>
  );
}

SearchResultsList.displayName = "Search.Results.List";

SearchResultsList.propTypes = {
  results: PropTypes.array,
  pagination: PropTypes.object,
  paginationClickHandler: PropTypes.func.isRequired,
  context: PropTypes.string,
  hideParent: PropTypes.bool
};
