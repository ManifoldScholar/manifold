import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import AddEditTOCEntryForm from "backend/components/authoring/AddEditTOCEntryForm";
import { useParams } from "react-router-dom";

export default function AddEditTOCEntryContainer({ tree, ...props }) {
  const { t } = useTranslation();
  const { entryId } = useParams();

  return (
    <section>
      <Layout.DrawerHeader
        title={entryId ? t("texts.toc.edit_header") : t("texts.toc.add_header")}
      />
      <AddEditTOCEntryForm entry={tree.items[entryId]} tree={tree} {...props} />
    </section>
  );
}

AddEditTOCEntryContainer.displayName = "Text.TOC.Entry";

AddEditTOCEntryContainer.propTypes = {
  textId: PropTypes.string.isRequired,
  sections: PropTypes.array.isRequired,
  toc: PropTypes.array,
  tree: PropTypes.object,
  setTree: PropTypes.func.isRequired
};
