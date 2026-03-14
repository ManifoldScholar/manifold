import { useMemo } from "react";
import { Navigate, useFetcher, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { contentBlocksAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import ContentBlock from "backend/components/content-block";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      contentBlocksAPI.create(params.id, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ContentBlockNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { pendingBlock, project, closeCallback } = useOutletContext() || {};

  const contentBlock = useMemo(() => {
    if (!pendingBlock) return null;
    return { ...pendingBlock, id: null };
  }, [pendingBlock]);

  if (!pendingBlock || !project) {
    return (
      <Navigate to={`/backend/projects/${project?.id}/layout`} replace />
    );
  }

  const formatData = data => {
    const adjusted = { ...data };
    adjusted.attributes = {
      ...adjusted.attributes,
      position: pendingBlock.attributes.position,
      type: pendingBlock.attributes.type
    };
    return adjusted;
  };

  return (
    <section>
      <ContentBlock.DrawerHeader contentBlock={pendingBlock} />
      <FormContainer.Form
        model={contentBlock}
        fetcher={fetcher}
        formatData={formatData}
        className="form-secondary"
        notifyOnSuccess
        onSuccess={closeCallback}
      >
        <ContentBlock.TypeForm
          contentBlock={pendingBlock}
          project={project}
        />
        <Form.Save text={t("actions.save")} />
      </FormContainer.Form>
    </section>
  );
}
