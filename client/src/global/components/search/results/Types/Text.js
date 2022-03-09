import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import Generic from "./Generic";
import withSearchResultHelper from "./searchResultHelper";
import * as Styled from "./styles";

function SearchResultsTypeText({ result, highlightedAttribute }) {
  const { t } = useTranslation();

  if (!result) return null;

  const model = result.relationships?.model;

  if (!model) return null;

  const { attributes } = model ?? {};

  const {
    searchableId,
    searchableType,
    title,
    parents: { project }
  } = result.attributes ?? {};

  const collectable = {
    type: searchableType,
    id: searchableId,
    attributes: { title }
  };

  const resultProps = {
    url: lh.link("reader", attributes?.slug),
    title: highlightedAttribute("title"),
    parent: project?.title,
    parentUrl: lh.link("frontendProjectDetail", project?.slug),
    description: highlightedAttribute("fullText"),
    label: t("glossary.text_one"),
    collectable
  };

  return (
    <Generic
      {...resultProps}
      figure={
        <Styled.ThumbnailNarrow
          entity={model}
          width="100%"
          height={null}
          $isSvg={!attributes?.coverStyles?.smallPortrait}
        />
      }
      meta={
        <FormattedDate
          prefix={t("dates.published_title_case")}
          format="MMMM, yyyy"
          date={attributes?.createdAt}
        />
      }
    />
  );
}

SearchResultsTypeText.displayName = "Search.Results.Type.Text";

SearchResultsTypeText.propTypes = {
  result: PropTypes.object,
  highlightedAttribute: PropTypes.func.isRequired
};

export default withSearchResultHelper(SearchResultsTypeText);
