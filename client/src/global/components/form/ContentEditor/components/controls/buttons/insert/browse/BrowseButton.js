import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "global/components/atomic/Button";
import BrowseModal from "./BrowseModal";

export default function BrowseButton(props) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={e => {
          e.preventDefault();
          setIsOpen(true);
        }}
        label="Browse"
        size="md"
        background="outline-accent"
      />
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
