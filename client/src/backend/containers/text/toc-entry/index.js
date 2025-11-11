import { useTranslation } from "react-i18next";
import { useParams, useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import AddEditTOCEntryForm from "backend/components/authoring/AddEditTOCEntryForm";

export default function AddEditTOCEntryContainer() {
  const { t } = useTranslation();
  const { entryId } = useParams();
  const { tree, setTree, textId, sections, toc } = useOutletContext() || {};

  if (!tree) return null;

  return (
    <section>
      <Layout.DrawerHeader
        title={entryId ? t("texts.toc.edit_header") : t("texts.toc.add_header")}
      />
      <AddEditTOCEntryForm
        entry={tree.items[entryId]}
        tree={tree}
        setTree={setTree}
        textId={textId}
        sections={sections}
        toc={toc}
      />
    </section>
  );
}

AddEditTOCEntryContainer.displayName = "Text.TOC.Entry";
