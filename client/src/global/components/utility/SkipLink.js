import React from "react";
import { useTranslation } from "react-i18next";

export default function SkipLink() {
  const { t } = useTranslation();
  return (
    <a className="skip-to-main" href="#skip-to-main">
      {t("navigation.skip_to_main")}
    </a>
  );
}
