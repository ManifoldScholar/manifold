import { useEffect, useRef } from "react";
import {
  useFetcher,
  useOutletContext,
  useNavigate,
  Navigate
} from "react-router";
import { useTranslation } from "react-i18next";
import { contentBlocksAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import ContentBlock from "components/backend/content-block";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => contentBlocksAPI.create(params.id, data)
});

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
