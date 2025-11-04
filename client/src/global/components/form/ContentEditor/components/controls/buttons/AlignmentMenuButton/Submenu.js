import { Menu as ReakitMenu, MenuItem as ReakitMenuItem } from "reakit/Menu";
import { useSlate, ReactEditor } from "slate-react";
import { Range, Node } from "slate";
import Utility from "global/components/utility";
import { setBlockClassName } from "../../../../utils/slate/transforms";
import {
  getClassNameWithAlign,
  getSelectionIndices,
  maybeApplyNestedBlockClassName
} from "./helpers";
import * as Styled from "./styles";

export default function Submenu({ menu, activeAlignment, block, path }) {
  const editor = useSlate();
  const { selection } = editor ?? {};

  const onClick = style => e => {
    e.preventDefault();

    if (!block) return;

    const hasInlineChildren = Object.hasOwn(block.children?.[0], "text");

    if (
      (Range.isCollapsed(selection) || hasInlineChildren) &&
      !block.slateOnly
    ) {
      setBlockClassName({
        editor,
        block,
        path,
        className: getClassNameWithAlign(block, style)
      });
    } else {
      const selectionRange = getSelectionIndices(selection, path);

      for (let i = selectionRange[0]; i <= selectionRange[1]; i++) {
        const childPath = [...path, i];
        const childBlock = Node.getIf(editor, childPath);
        maybeApplyNestedBlockClassName(editor, childBlock, childPath, style);
      }

      if (block.type === "li") {
        setBlockClassName({
          editor,
          block,
          path,
          className: getClassNameWithAlign(block, style)
        });
      }

      menu.hide();
      ReactEditor.focus(editor);
    }
  };

  return (
    <ReakitMenu as={Styled.Content} {...menu}>
      <ReakitMenuItem
        as={Styled.InnerButton}
        onClick={onClick("left")}
        data-active={activeAlignment === "manifold-rte-left"}
        {...menu}
      >
        <Utility.IconComposer icon="RTEAlignLeft32" size={24} />
      </ReakitMenuItem>
      <ReakitMenuItem
        as={Styled.InnerButton}
        onClick={onClick("center")}
        data-active={activeAlignment === "manifold-rte-center"}
        {...menu}
      >
        <Utility.IconComposer icon="RTEAlignCenter32" size={24} />
      </ReakitMenuItem>
      <ReakitMenuItem
        as={Styled.InnerButton}
        onClick={onClick("right")}
        data-active={activeAlignment === "manifold-rte-right"}
        {...menu}
      >
        <Utility.IconComposer icon="RTEAlignRight32" size={24} />
      </ReakitMenuItem>
      <ReakitMenuItem
        as={Styled.InnerButton}
        onClick={onClick("justify")}
        data-active={activeAlignment === "manifold-rte-justify"}
        {...menu}
      >
        <Utility.IconComposer icon="RTEAlignJustify32" size={24} />
      </ReakitMenuItem>
    </ReakitMenu>
  );
}
