import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Generic from "./Generic";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import withSearchResultHelper from "./searchResultHelper";
import EntityThumbnail from "global/components/entity-thumbnail";
import * as Styled from "./styles";

function SearchResultsTypeJournalVolume({ result, highlightedAttribute }) {
  const { t } = useTranslation();

  if (!result) return null;

  const model = result.relationships?.model;
  if (!model) return null;

  const { attributes } = model ?? {};

  const parentJournal = result.relationships?.journal;

  const title = t("journals.volume_number", {
    volNum: highlightedAttribute("number")
  });

  const { searchableType, searchableId } = result.attributes ?? {};
  const collectable = {
    type: searchableType,
    id: searchableId,
    attributes: { title }
  };
  const creators = model?.relationships?.creators ?? [];

  const resultProps = {
    url: lh.link("frontendVolumeDetail", attributes.slug),
    title,
    parent: parentJournal?.attributes?.titlePlaintext || null,
    parentUrl: parentJournal
      ? lh.link("frontendJournalDetail", parentJournal.attributes?.slug)
      : null,
    attribution: creators.map(c => c.attributes.fullName).join(", "),
    label: t("glossary.volume_one"),
    collectable
  };

  return (
    <Generic
      {...resultProps}
      figure={
        <Styled.Thumbnail
          as={EntityThumbnail.JournalVolume}
          placeholderAttributes={{ mode: "small" }}
          entity={model}
          width="100%"
          height={null}
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

SearchResultsTypeJournalVolume.displayName =
  "Search.Results.Type.JournalVolume";

SearchResultsTypeJournalVolume.propTypes = {
  result: PropTypes.object,
  highlightedAttribute: PropTypes.func.isRequired
};

export default withSearchResultHelper(SearchResultsTypeJournalVolume);
