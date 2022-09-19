import React from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import lh from "helpers/linkHandler";
import withSearchResultHelper from "./searchResultHelper";
import Utility from "global/components/utility";
import Generic from "./Generic";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

function SearchResultsTypeAnnotation({ result, highlightedAttribute }) {
  const { t } = useTranslation();

  if (!result) return null;

  const model = result.relationships?.model;

  if (!model) return null;

  const {
    searchableId,
    parents: { text, text_section: textSection }
  } = result.attributes ?? {};

  const parent = text?.title;
  const creator = model?.relationships?.creator?.attributes ?? {};

  const title = (
    <Trans
      i18nKey="search.annotation_title"
      values={{ name: creator.fullName, entity: parent }}
      components={[<Styled.AnnotationTitle />]}
    />
  );

  const hasValidLink = text?.slug && textSection?.id && searchableId;

  const parentUrl = hasValidLink
    ? lh.link("readerSection", text.slug, textSection.id)
    : null;
  const url = parentUrl ? `${parentUrl}#annotation-${searchableId}` : undefined;

  const resultProps = {
    url,
    title,
    description: highlightedAttribute("fullText"),
    label: t("glossary.annotation_one")
  };

  return (
    <Generic
      {...resultProps}
      figure={
        <>
          {creator?.avatarStyles?.smallSquare ? (
            <Styled.Avatar
              alt={t("img_alts.avatar_for_name", { name: creator.fullName })}
              src={creator.avatarStyles.smallSquare}
            />
          ) : (
            <Styled.IconAvatar>
              <Utility.IconComposer icon="avatar64" />
            </Styled.IconAvatar>
          )}
        </>
      }
      meta={
        <>
          <FormattedDate
            format="distanceInWords"
            date={model.attributes.createdAt}
            suffix
          />
        </>
      }
    />
  );
}

SearchResultsTypeAnnotation.displayName = "Search.Results.Type.Annotation";

SearchResultsTypeAnnotation.propTypes = {
  result: PropTypes.object,
  highlightedAttribute: PropTypes.func.isRequired
};

export default withSearchResultHelper(SearchResultsTypeAnnotation);
