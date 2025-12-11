import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext, useParams } from "react-router";
import { textsAPI } from "api";
import Layout from "components/backend/layout";
import AddEditTOCEntryForm from "components/backend/authoring/AddEditTOCEntryForm";
import { formatTOCData } from "components/backend/authoring/TOCList/treeHelpers";
import formAction from "lib/react-router/helpers/formAction";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => textsAPI.update(params.id, data),
  redirectTo: ({ params }) => `/backend/projects/text/${params.id}/contents`
});

export default function EditTOCEntry() {
  const { t } = useTranslation();
  const { tree, textId, sections } = useOutletContext() || {};
  const { entryId } = useParams();
  const fetcher = useFetcher();

  const entry = tree?.items[entryId];

  const formatData = useCallback(
    dirty => {
      const update = {
        ...entry,
        data: {
          ...entry.data,
          sectionId: dirty.sectionId ?? entry.data.sectionId,
          title: dirty.label ?? entry.data.title,
          anchor: dirty.anchor ?? entry.data.anchor
        }
      };

      const newTree = {
        ...tree,
        items: { ...tree.items, [entry.id]: update }
      };
      return { attributes: { toc: formatTOCData(newTree) } };
    },
    [entry, tree]
  );

  if (!tree) return null;

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.toc.edit_header")} />
      <AddEditTOCEntryForm
        fetcher={fetcher}
        formatData={formatData}
        entry={entry}
        textId={textId}
        sections={sections}
      />
    </section>
  );
}
