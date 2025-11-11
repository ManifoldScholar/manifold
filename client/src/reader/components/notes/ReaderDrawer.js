import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FilteredList from "./FilteredList";
import ReaderNotes from "reader/containers/ReaderNotes";
import GlobalDrawer from "global/containers/drawer";

export default function ReaderDrawer({ visible, closeCallback }) {
  const { t } = useTranslation();

  const drawerProps = {
    open: visible,
    context: "reader",
    size: "wide",
    position: "overlay",
    padding: "none",
    identifier: "notes-drawer",
    lockScroll: "always",
    includeDrawerFrontMatter: true,
    focusTrap: false,
    title: t("glossary.note_title_case_other"),
    closeCallback,
    additionalDrawerProps: { "aria-modal": true }
  };

  return (
    <GlobalDrawer.Wrapper {...drawerProps}>
      {visible && (
        <ReaderNotes>
          <FilteredList />
        </ReaderNotes>
      )}
    </GlobalDrawer.Wrapper>
  );
}

ReaderDrawer.displayName = "Notes.ReaderDrawer";

ReaderDrawer.propTypes = {
  visible: PropTypes.bool,
  closeCallback: PropTypes.func
};
