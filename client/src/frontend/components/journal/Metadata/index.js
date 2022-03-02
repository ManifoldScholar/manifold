import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ContentBlock from "frontend/components/content-block/Block";
import isEmpty from "lodash/isEmpty";

function Metadata({ journal }) {
  const { t } = useTranslation();

  const { metadata } = journal.attributes;

  if (!metadata || isEmpty(metadata)) return null;

  return (
    <ContentBlock
      block={{
        attributes: {
          renderable: true,
          type: "Content::MetadataBlock",
          title: t("pages.subheaders.journal_info"),
          icon: "journals64"
        }
      }}
      entity={journal}
    />
  );
}

Metadata.displayName = "Journal.Metadata";

Metadata.propTypes = {
  journal: PropTypes.object.isRequired
};

export default Metadata;
