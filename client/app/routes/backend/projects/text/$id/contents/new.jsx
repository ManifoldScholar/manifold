import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import { textsAPI } from "api";
import Layout from "components/backend/layout";
import AddEditTOCEntryForm from "components/backend/authoring/AddEditTOCEntryForm";
import formAction from "lib/react-router/helpers/formAction";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => textsAPI.update(params.id, data),
  redirectTo: ({ params }) => `/backend/projects/text/${params.id}/contents`
});

export default function NewTOCEntry() {
  const { t } = useTranslation();
  const { toc, textId, sections } = useOutletContext() || {};
  const fetcher = useFetcher();

  const formatData = useCallback(
    dirty => {
      const newEntry = {
        id: dirty.sectionId,
        label: dirty.label,
        anchor: dirty.anchor
      };
      return { attributes: { toc: [...(toc || []), newEntry] } };
    },
    [toc]
  );

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.toc.add_header")} />
      <AddEditTOCEntryForm
        fetcher={fetcher}
        formatData={formatData}
        textId={textId}
        sections={sections}
      />
    </section>
  );
}
