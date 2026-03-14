import { useCallback } from "react";
import { useFetcher, useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { contentBlocksAPI } from "api";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import Dialog from "global/components/dialog";
import ContentBlock from "backend/components/content-block";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => contentBlocksAPI.show(params.blockId),
    request
  });
};

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      contentBlocksAPI.update(params.blockId, data),
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

export default function ContentBlockEdit({ loaderData: contentBlock }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { project, closeCallback, closeUrl } = useOutletContext() || {};
  const { confirm, confirmation } = useConfirmation();

  const updateContentBlock = useApiCallback(contentBlocksAPI.update);
  const deleteContentBlock = useApiCallback(contentBlocksAPI.destroy);

  const onVisibilityToggle = useCallback(() => {
    if (!contentBlock) return;
    updateContentBlock(contentBlock.id, {
      attributes: { visible: !contentBlock.attributes.visible }
    }).then(() => {
      if (closeCallback) closeCallback();
    });
  }, [contentBlock, updateContentBlock, closeCallback]);

  const onDelete = useCallback(() => {
    confirm({
      heading: t("modals.delete_content_block"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        if (!contentBlock) return;
        await deleteContentBlock(contentBlock.id);
        closeDialog();
        if (closeCallback) closeCallback();
        navigate(closeUrl, { state: { noScroll: true } });
      }
    });
  }, [confirm, t, contentBlock, deleteContentBlock, closeCallback, navigate, closeUrl]);

  if (!contentBlock || !project) return null;

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
        onSuccess={closeCallback}
      >
        <ContentBlock.TypeForm
          contentBlock={contentBlock}
          project={project}
        />
        <Form.Save text={t("actions.save")} />
      </FormContainer.Form>
    </section>
  );
}
