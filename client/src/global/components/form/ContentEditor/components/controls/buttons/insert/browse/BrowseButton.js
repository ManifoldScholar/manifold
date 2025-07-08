import { useConfirmation } from "hooks";
import { useTranslation } from "react-i18next";
import BrowseModal from "./BrowseModal";

export default function BrowseButton() {
  const { t } = useTranslation();
  const { confirm, confirmation } = useConfirmation();

  const onClick = e => {
    e.preventDefault();

    if (confirm)
      confirm({
        heading: "Browse",
        icon: "Resource24",
        callback: close => close(),
        closeCallback: close => close(),
        resolveLabel: t("actions.continue")
      });
  };

  return (
    <button
      onClick={onClick}
      className="button-secondary button-secondary--outlined"
    >
      <span>Browse</span>
      {confirmation && <BrowseModal {...confirmation} />}
    </button>
  );
}
