import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import EntityThumbnail from "global/components/entity-thumbnail";
import Generic from "./Generic";
import withSearchResultHelper from "./searchResultHelper";
import * as Styled from "./styles";

function SearchResultsTypeResource({
  result,
  highlightedAttribute,
  hideParent = false
}) {
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

  const creators = model?.relationships?.creators ?? [];

  const resultProps = {
    url: lh.link("frontendProjectResource", project?.slug, attributes?.slug),
    title: highlightedAttribute("title"),
    parent: project?.title,
    parentUrl: lh.link("frontendProjectDetail", project?.slug),
    hideParent,
    attribution: creators.map(c => c.attributes.fullName).join(", "),
    description: highlightedAttribute("fullText"),
    label: t("glossary.resource_one"),
    collectable
  };

  return (
    <Generic
      {...resultProps}
      figure={
        <Styled.Thumbnail
          as={EntityThumbnail.Resource}
          entity={model}
          width="100%"
          height={null}
        />
      }
      meta={
        <FormattedDate
          prefix={t("dates.type_of_resource_added", { kind: attributes?.kind })}
          format="MMMM, yyyy"
          date={attributes?.createdAt}
        />
      }
    />
  );
}

SearchResultsTypeResource.displayName = "Search.Results.Type.Resource";

SearchResultsTypeResource.propTypes = {
  result: PropTypes.object,
  highlightedAttribute: PropTypes.func.isRequired,
  hideParent: PropTypes.bool
};

export default withSearchResultHelper(SearchResultsTypeResource);
