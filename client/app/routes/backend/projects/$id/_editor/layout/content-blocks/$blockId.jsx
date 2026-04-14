import { useCallback } from "react";
import { useFetcher, useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { contentBlocksAPI } from "api";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import formAction from "app/routes/utility/helpers/formAction";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import FormContainer from "components/global/form/Container";
import Form from "components/global/form";
import Dialog from "components/global/dialog";
import ContentBlock from "components/backend/content-block";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => contentBlocksAPI.show(params.blockId),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) => contentBlocksAPI.update(params.blockId, data),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/layout`
});

export default function ContentBlockEdit({ loaderData: contentBlock }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { project } = useOutletContext() ?? {};
  const { confirm, confirmation } = useConfirmation();

  const updateContentBlock = useApiCallback(contentBlocksAPI.update);
  const deleteContentBlock = useApiCallback(contentBlocksAPI.destroy);

  const onVisibilityToggle = useCallback(() => {
    if (!contentBlock) return;
    updateContentBlock(contentBlock.id, {
      attributes: { visible: !contentBlock.attributes.visible }
    });
  }, [contentBlock, updateContentBlock]);

  const onDelete = useCallback(() => {
    confirm({
      heading: t("modals.delete_content_block"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        if (!contentBlock) return;
        await deleteContentBlock(contentBlock.id);
        closeDialog();
        navigate(`/backend/projects/${project.id}/layout`, {
          state: { noScroll: true }
        });
      }
    });
  }, [confirm, t, contentBlock, deleteContentBlock, navigate, project]);

  return (
    <section>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <ContentBlock.DrawerHeader
        contentBlock={contentBlock}
        onVisibilityToggle={onVisibilityToggle}
        onDelete={onDelete}
      />
      <FormContainer.Form
        model={contentBlock}
        fetcher={fetcher}
        className="form-secondary"
        notifyOnSuccess
      >
        <ContentBlock.TypeForm contentBlock={contentBlock} project={project} />
        <Form.Save text={t("actions.save")} />
      </FormContainer.Form>
    </section>
  );
}
