import { useEffect, useRef, useCallback } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { contentBlocksAPI, requests } from "api";
import { useFetch, useApiCallback } from "hooks";
import Form from "./Form";
import ContentBlock from "backend/components/content-block";
import lh from "helpers/linkHandler";
import withConfirmation from "hoc/withConfirmation";

function ContentBlockEditContainer({ confirm }) {
  const outletContext = useOutletContext() || {};
  const { project } = outletContext;
  const { blockId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const prevIdRef = useRef(blockId);

  const { data: contentBlock } = useFetch({
    request: [contentBlocksAPI.show, blockId],
    condition: !!blockId
  });

  useEffect(() => {
    if (blockId && prevIdRef.current && blockId !== prevIdRef.current) {
      prevIdRef.current = blockId;
    }
  }, [blockId]);

  const updateContentBlock = useApiCallback(contentBlocksAPI.update, {
    requestKey: requests.beContentBlockUpdate
  });

  const deleteContentBlock = useApiCallback(contentBlocksAPI.destroy, {
    requestKey: requests.beContentBlockDestroy,
    removes: { type: "contentBlocks", blockId: contentBlock?.blockId }
  });

  const onVisibilityToggle = useCallback(() => {
    if (!contentBlock) return;
    updateContentBlock(contentBlock.blockId, {
      attributes: { visible: !contentBlock.attributes.visible }
    });
  }, [contentBlock, updateContentBlock]);

  const doDelete = useCallback(async () => {
    if (!contentBlock || !project) return;
    await deleteContentBlock(contentBlock.blockId);
    navigate(lh.link("backendProjectLayout", project.blockId));
  }, [contentBlock, project, deleteContentBlock, navigate]);

  const onDelete = useCallback(() => {
    const heading = t("modals.delete_content_block");
    const message = t("modals.confirm_body");
    confirm(heading, message, doDelete);
  }, [confirm, t, doDelete]);

  if (!contentBlock || !project) return null;

  return (
    <section>
      <ContentBlock.DrawerHeader
        contentBlock={contentBlock}
        onVisibilityToggle={onVisibilityToggle}
        onDelete={onDelete}
      />
      <Form contentBlock={contentBlock} project={project} />
    </section>
  );
}

ContentBlockEditContainer.displayName = "ContentBlock.Edit";

export default withConfirmation(ContentBlockEditContainer);
