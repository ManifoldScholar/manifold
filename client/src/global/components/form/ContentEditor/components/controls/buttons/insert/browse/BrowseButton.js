import { useState } from "react";
import { useTranslation } from "react-i18next";
import BrowseModal from "./BrowseModal";

export default function BrowseButton(props) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={e => {
          e.preventDefault();
          setIsOpen(true);
        }}
        className="button-secondary button-secondary--outlined"
      >
        <span>Browse</span>
      </button>
      {isOpen && (
        <BrowseModal
          icon="Resource24"
          addLabel={t("actions.add")}
          closeModal={() => setIsOpen(false)}
          {...props}
        />
      )}
    </>
  );
}
