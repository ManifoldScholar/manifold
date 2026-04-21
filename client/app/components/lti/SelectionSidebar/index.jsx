import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelection } from "contexts";
import Contents from "./Contents";
import * as Styled from "./styles";

export default function SelectionSidebar({ dialog }) {
  const { t } = useTranslation();
  const { items } = useSelection();
  const count = items.length;
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count > prevCountRef.current && !dialog.open) {
      dialog.onToggleClick();
    }
    prevCountRef.current = count;
  }, [count, dialog]);

  return (
    <>
      {!dialog.open && (
        <Styled.SidebarToggle
          ref={dialog.toggleRef}
          type="button"
          onClick={dialog.onToggleClick}
          aria-label={t("lti.sidebar.open_selected", { count })}
        >
          {count > 0
            ? t("lti.sidebar.selected_count", { count })
            : t("lti.sidebar.selected_none")}
        </Styled.SidebarToggle>
      )}
      <Styled.Sidebar ref={dialog.dialogRef}>
        <Contents onClose={dialog.onCloseClick} />
      </Styled.Sidebar>
    </>
  );
}
