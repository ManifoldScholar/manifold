import { forwardRef } from "react";
import { Transforms } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import {
  Menu as ReakitMenu,
  MenuItem as ReakitMenuItem,
  MenuButton as ReakitMenuButton,
  useMenuState
} from "reakit/Menu";
import { getCommonBlock } from "../../../../utils/slate/getters";
import { rteElements, nestableElements } from "../../../../utils/elements";
import capitalize from "lodash/capitalize";
import * as SharedStyled from "../styles";
import * as Styled from "./styles";

const AlignmentMenuButton = ({ size, ...rest }, ref) => {
  const editor = useSlate();
  const { selection } = editor ?? {};

  const { t } = useTranslation();

  const menu = useMenuState({
    orientation: "vertical",
    loop: true,
    wrap: "vertical",
    gutter: 7
  });

  const condition = node =>
    [...rteElements, ...nestableElements].includes(node?.type);

  const [block, path] = selection ? getCommonBlock(editor, condition) : [];

  const activeAlignmentClass = block?.htmlAttrs?.class
    ? block.htmlAttrs.class.split(" ").find(c => c.includes("manifold-rte"))
    : null;

  const onClick = style => e => {
    e.preventDefault();

    if (!block) return;

    let classes;

    if (style) {
      classes = block.htmlAttrs?.class
        ? block.htmlAttrs.class
            .split(" ")
            .filter(c => !c.startsWith("manifold-rte"))
            .concat(`manifold-rte-${style}`)
            .join(" ")
        : `manifold-rte-${style}`;
    } else {
      classes = block.htmlAttrs?.class
        ? block.htmlAttrs.class
            .split(" ")
            .filter(c => !c.startsWith("manifold-rte"))
            .join(" ")
        : "";
    }

    Transforms.setNodes(
      editor,
      {
        ...block,
        htmlAttrs: {
          ...block.htmlAttrs,
          class: classes
        }
      },
      { at: path, mode: "highest" }
    );

    menu.hide();
    ReactEditor.focus(editor);
  };

  const outerIcon = activeAlignmentClass
    ? `RTEAlign${capitalize(activeAlignmentClass.split("-")[2])}32`
    : "RTEAlignLeft32";

  return (
    <Styled.Wrapper>
      <ReakitMenuButton
        as={SharedStyled.Button}
        ref={ref}
        {...rest}
        aria-label={t("editor.controls.labels.format")}
        data-active={menu.visible}
        tabIndex={-1}
        {...menu}
        onClick={e => {
          e.preventDefault();
          menu.toggle();
        }}
      >
        <Utility.IconComposer icon={outerIcon} size={24} />
      </ReakitMenuButton>
      <ReakitMenu as={Styled.Content} {...menu}>
        <ReakitMenuItem
          as={Styled.InnerButton}
          onClick={onClick()}
          data-active={!activeAlignmentClass}
          {...menu}
        >
          <Utility.IconComposer icon="RTEAlignLeft32" size={24} />
        </ReakitMenuItem>
        <ReakitMenuItem
          as={Styled.InnerButton}
          onClick={onClick("center")}
          data-active={activeAlignmentClass === "manifold-rte-center"}
          {...menu}
        >
          <Utility.IconComposer icon="RTEAlignCenter32" size={24} />
        </ReakitMenuItem>
        <ReakitMenuItem
          as={Styled.InnerButton}
          onClick={onClick("right")}
          data-active={activeAlignmentClass === "manifold-rte-right"}
          {...menu}
        >
          <Utility.IconComposer icon="RTEAlignRight32" size={24} />
        </ReakitMenuItem>
        <ReakitMenuItem
          as={Styled.InnerButton}
          onClick={onClick("justify")}
          data-active={activeAlignmentClass === "manifold-rte-justify"}
          {...menu}
        >
          <Utility.IconComposer icon="RTEAlignJustify32" size={24} />
        </ReakitMenuItem>
      </ReakitMenu>
    </Styled.Wrapper>
  );
};

export default forwardRef(AlignmentMenuButton);
