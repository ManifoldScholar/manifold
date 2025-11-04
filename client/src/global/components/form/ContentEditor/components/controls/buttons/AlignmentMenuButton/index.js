import { forwardRef } from "react";
import { useSlate } from "slate-react";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import { MenuButton as ReakitMenuButton, useMenuState } from "reakit/Menu";
import AlignmentSubmenu from "./Submenu";
import { getCommonBlock } from "../../../../utils/slate/getters";
import { getActiveAlignment } from "./helpers";
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

  const condition = node => node.type !== "list-sibling";
  const [block, path] = selection
    ? getCommonBlock(editor, condition) ?? []
    : [];

  const activeAlignment = getActiveAlignment(selection, block, path);

  const outerIcon = activeAlignment
    ? `RTEAlign${capitalize(activeAlignment.split("-")[2])}32`
    : "RTEAlignLeft32";

  return (
    <Styled.Wrapper>
      <ReakitMenuButton
        as={SharedStyled.Button}
        ref={ref}
        {...rest}
        aria-label={t("editor.controls.labels.alignment")}
        data-active={menu.visible || !!activeAlignment}
        {...menu}
        onClick={e => {
          e.preventDefault();
          menu.toggle();
        }}
      >
        <Utility.IconComposer icon={outerIcon} size={24} />
      </ReakitMenuButton>
      <AlignmentSubmenu
        menu={menu}
        activeAlignment={activeAlignment}
        block={block}
        path={path}
      />
    </Styled.Wrapper>
  );
};

export default forwardRef(AlignmentMenuButton);
