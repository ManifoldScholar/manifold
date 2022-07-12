import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import TOC from "frontend/components/toc";

function ProjectContentBlockTableOfContentsBlock({ block }) {
  const { t } = useTranslation();
  const {
    relationships: { text },
    attributes: { depth, showAuthors, showTextTitle }
  } = block;

  return (
    <nav aria-label={t("glossary.table_of_contents_title_case")}>
      <TOC.List
        showTextTitle={showTextTitle}
        showAuthors={showAuthors}
        text={text}
        depth={depth}
      />
    </nav>
  );
}

ProjectContentBlockTableOfContentsBlock.displayName =
  "Project.Content.Block.TableOfContents";

ProjectContentBlockTableOfContentsBlock.propTypes = {
  block: PropTypes.object.isRequired
};

ProjectContentBlockTableOfContentsBlock.title = "Table of Contents";
ProjectContentBlockTableOfContentsBlock.icon = "toc64";

export default ProjectContentBlockTableOfContentsBlock;
