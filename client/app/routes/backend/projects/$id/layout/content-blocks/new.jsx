import { useEffect, useRef } from "react";
import {
  useFetcher,
  useOutletContext,
  useNavigate,
  Navigate
} from "react-router";
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
  const navigate = useNavigate();
  const { pendingBlock, project, clearPendingBlock } = useOutletContext() ?? {};

  const pendingRef = useRef(pendingBlock);

  useEffect(() => {
    if (fetcher.data?.success && pendingBlock) {
      navigate(`/backend/projects/${project.id}/layout`);
      clearPendingBlock();
    }
  }, [fetcher, clearPendingBlock, navigate, pendingBlock, project.id]);

  if (!pendingRef.current) {
    return <Navigate to={`/backend/projects/${project.id}/layout`} replace />;
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
      <ContentBlock.DrawerHeader contentBlock={pendingRef.current} />
      <FormContainer.Form
        model={pendingRef.current}
        fetcher={fetcher}
        formatData={formatData}
        className="form-secondary"
      >
        <ContentBlock.TypeForm
          contentBlock={pendingRef.current}
          project={project}
        />
        <Form.Save text={t("actions.save")} />
      </FormContainer.Form>
    </section>
  );
}
