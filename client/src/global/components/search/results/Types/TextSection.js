import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import Generic from "./Generic";
import withSearchResultHelper from "./searchResultHelper";
import EntityThumbnail from "global/components/entity-thumbnail";
import * as Styled from "./styles";

function SearchResultsTypeTextSection({ result, highlightedAttribute }) {
  const { t } = useTranslation();

  if (!result) return null;

  const model = result.relationships?.model;

  if (!model) return null;

  const {
    searchableId,
    searchableType,
    title,
    parents: { text }
  } = result.attributes ?? {};

  const collectable = {
    type: searchableType,
    id: searchableId,
    attributes: { title }
  };

  const {
    attributes: { textNodes }
  } = result;
  const excerpts = (() => {
    if (!textNodes.total.value) return [];
    const { hits } = textNodes;
    return hits.map(h => ({
      ...h,
      url: lh.link("readerSection", text.slug, model.id, `#node-${h.nodeUuid}`)
    }));
  })();

  const resultProps = {
    url: lh.link("readerSection", text?.slug, model.id),
    title: highlightedAttribute("title"),
    parent: text?.title,
    parentUrl: lh.link("reader", text?.slug),
    description: highlightedAttribute("fullText"),
    label: t("glossary.full_text_one"),
    collectable,
    excerpts
  };

  return (
    <Generic
      {...resultProps}
      figure={
        <Styled.ThumbnailNarrow
          as={EntityThumbnail.TextSection}
          entity={model}
          width="100%"
          height={null}
          $isSvg={!model.attributes?.coverStyles?.smallPortrait}
        />
      }
    />
  );
}

SearchResultsTypeTextSection.displayName = "Search.Results.Type.TextSection";

SearchResultsTypeTextSection.propTypes = {
  result: PropTypes.object,
  highlightedAttribute: PropTypes.func.isRequired
};

export default withSearchResultHelper(SearchResultsTypeTextSection);
