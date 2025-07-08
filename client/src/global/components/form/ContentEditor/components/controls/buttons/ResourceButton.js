import { forwardRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSlate, ReactEditor } from "slate-react";
import { Transforms, Editor, Element as SlateElement } from "slate";
import Utility from "global/components/utility";
import { useConfirmation } from "hooks";
import BrowseModal from "./insert/browse/BrowseModal";
import { isElementActive } from "../../../utils/slate/getters";
import { insertResource } from "../../../utils/slate/transforms";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys } from "./TooltipContent/content";
import { onModalClose } from "./utils";
import * as Styled from "./styles";

const ResourceButton = ({ icon, size, ...rest }, ref) => {
  const { t } = useTranslation();
  const editor = useSlate();
  const { selection } = editor ?? {};

  const [resourceId, setResourceId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [active] = isElementActive(editor, "resource-block");

  const addResource = useCallback(() => {
    if (!resourceId) return;
    setIsOpen(false);
    return insertResource(editor, resourceId);
  }, [resourceId, editor]);

  const updateResource = () => {
    if (!resourceId) return;
    setIsOpen(false);
    Transforms.setNodes(editor, {
      htmlAttrs: { display: "full", resourceid: resourceId }
    });
    ReactEditor.focus(editor);
  };

  const getResourceData = e => {
    e.preventDefault();
    if (!selection) return;

    if (active) {
      const [[resource]] = Array.from(
        Editor.nodes(editor, {
          at: Editor.unhangRange(editor, selection),
          match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "resource-block"
        })
      );

      const attrs = resource?.htmlAttrs ?? {};
      setResourceId(attrs.resourceid);
    }

    setIsOpen(true);
  };

  const onCancel = () => {
    setResourceId(null);
    onModalClose(editor, selection);
  };

  return (
    <Tooltip
      content={
        <TooltipContent
          label={t(`editor.tooltips.labels.img`)}
          description={t(`editor.tooltips.descriptions.img`)}
          hotkeys={hotkeys.img}
        />
      }
      xOffset="-75px"
      yOffset="43px"
      delay={0.5}
    >
      <div>
        <Styled.Button
          name="resource-modal-trigger"
          ref={ref}
          {...rest}
          aria-label={t("editor.controls.labels.resource")}
          data-active={active}
          onClick={getResourceData}
          tabIndex={-1}
        >
          {icon && <Utility.IconComposer icon={icon} size={size} />}
        </Styled.Button>
        {isOpen && (
          <BrowseModal
            addLabel={t("actions.add")}
            onCancel={onCancel}
            onAdd={active ? updateResource : addResource}
            active={resourceId}
            setActive={setResourceId}
            heading={t("editor.forms.resource_insert_heading")}
            icon={icon}
          />
        )}
      </div>
    </Tooltip>
  );
};

export default forwardRef(ResourceButton);
