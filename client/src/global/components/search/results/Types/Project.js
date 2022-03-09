import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Generic from "./Generic";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import withSearchResultHelper from "./searchResultHelper";
import * as Styled from "./styles";

function SearchResultsTypeProject({ result, highlightedAttribute }) {
  const { t } = useTranslation();

  if (!result) return null;

  const model = result.relationships?.model;
  if (!model) return null;

  const { attributes } = model ?? {};

  const { searchableType, searchableId, title } = result.attributes ?? {};
  const collectable = {
    type: searchableType,
    id: searchableId,
    attributes: { title }
  };
  const creators = model?.relationships?.creators ?? [];

  const resultProps = {
    url: lh.link("frontendProjectDetail", attributes.slug),
    title: highlightedAttribute("title"),
    attribution: creators.map(c => c.attributes.fullName).join(", "),
    description: highlightedAttribute("fullText"),
    label: t("glossary.project_one"),
    collectable
  };

  return (
    <Generic
      {...resultProps}
      figure={
        <Styled.Thumbnail
          placeholderAttributes={{ mode: "small" }}
          entity={model}
          width="100%"
          height={null}
          $isImg={
            attributes.avatarStyles?.small ||
            attributes.avatarStyles?.smallSquare
          }
        />
      }
      meta={
        <FormattedDate
          prefix={t("dates.published_title_case")}
          format="MMMM, yyyy"
          date={attributes.createdAt}
        />
      }
    />
  );
}

SearchResultsTypeProject.displayName = "Search.Results.Type.Project";

SearchResultsTypeProject.propTypes = {
  result: PropTypes.object,
  highlightedAttribute: PropTypes.func.isRequired
};

export default withSearchResultHelper(SearchResultsTypeProject);
